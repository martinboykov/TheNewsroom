/* eslint new-cap: ["error", { "capIsNew": false }]*/
/* eslint-disable no-process-env*/

const { User, validateUser } = require('../models/user');

const bcrypt = require('bcrypt-nodejs');

const { client } = require('./../middleware/redis');

const HOST_ADDRESS = process.env.HOST_ADDRESS;

const getUsersByType = async (req, res, next) => {
  const userType = req.query.userType;
  let usersQuery;
  switch (userType) {
    case 'Admin':
      usersQuery = User
        .find({ 'roles.isAdmin': true })
        .select('-password');
      break;
    case 'Writer':
      usersQuery = User
        .find({ 'roles.isWriter': true })
        .select('-password');
      break;
    case 'Reader':
      usersQuery = User
        .find({ 'roles.isReader': true })
        .select('-password');
      break;
    default:
      usersQuery = User
        .find({
          'roles.isAdmin': false,
          'roles.isWriter': false,
          'roles.isReader': false,
        })
        .select('-password');
      break;
  }
  const users = await usersQuery;
  return res.status(200).json({
    message: 'Users fetched successfully',
    data: users,
  });
};

const getUserById = async (req, res, next) => {
  const user = await User
    .findOne({
      _id: req.params._id,
    })
    .select('-password');
  if (!user) return res.status(404).json({ message: 'No such user!' });
  return res.status(200).json({
    message: 'Reader users fetched successfully',
    data: user,
  });
};

const updateUserRole = async (req, res, next) => {
  const _id = req.params._id;
  const userUpdated = req.body;
  const user = await User.findOne(
    { _id: _id },
  );
  // console.log(user);
  if (!user) return res.status(404).json({ message: 'No such user!' });
  user.roles = userUpdated.roles;
  await user.save();

  if (client.connected) {
    redisDeleteUserKeys();
  }

  return res.status(201).json({
    message: 'Post popularity updated successfully',
    data: user.roles,
  });
};

async function redisDeleteUserKeys() {
  const baseUrl = HOST_ADDRESS + `/api/users`;
  const patternComments = baseUrl + '*';
  const keysComments = await client.keysAsync(patternComments);
  // delete old comments pages from redis... (outdated)
  if (keysComments.length > 0) await client.delAsync(keysComments);
  // restores redis db for all comments in the Post
}

const signup = async (req, res, next) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) {
    return res.status(400).json({
      message: 'User with this email exists',
    });
  }
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    // 'roles.isAdmin': false, // authorization
  });
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const usersCount = await User.estimatedDocumentCount();
  if (usersCount === 0) {
    user.roles.isAdmin = true;
    user.roles.isWriter = true;
  }

  // Encrypting the password bofore saving to db
  const salt = await bcrypt.genSaltSync(10);
  user.password = await bcrypt.hashSync(req.body.password, salt);
  await user.save();
  return res.status(201).json({
    message: 'Signup successfuly',
    data: { _id: user._id, name: user.name, email: user.email },
  });
};

const login = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({
      message: 'No user with this email.',
    });
  }
  const validPassword = await bcrypt.compareSync(
    req.body.password,
    user.password);
  if (!validPassword) {
    return res.status(400).json({
      message: 'Invalid password.',
    });
  }
  const token = user.generateAuthToken();
  // console.log(`${user.name} logged in successfuly`);
  return res.status(200).json({
    message: 'Logged in successfuly',
    data: {
      token: token,
      expiresIn: 3600,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        avatar: user.avatar,
      }, // authorization
    },
  });
};

module.exports = {
  getUserById,
  getUsersByType,
  updateUserRole,
  signup,
  login,
};
