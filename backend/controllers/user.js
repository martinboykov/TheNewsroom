/* eslint new-cap: ["error", { "capIsNew": false }]*/
const { User, validateUser } = require('../models/user');
const bcrypt = require('bcrypt');

const getUserById = async (req, res, next) => {
  const user = await User.findOne({
    _id: req.params._id,
  });
  if (!user) return res.status(404).json({ message: 'No such user!' });
  return res.status(200).json({
    message: 'Reader users fetched successfully',
    data: user,
  });
};

const getSearchedUser = async (req, res, next) => {
  const searchString = req.params.searchQuery;
  const user = await User
    .findOne({
      $text: {
        $search: searchString,
      },
    })
    .select(
      '-_password');
  if (!user) return res.status(404).json({ message: 'No such user!' });
  return res.status(200).json({
    message: 'Posts fetched successfully',
    data: user,
  });
};

const getUsersReaders = async (req, res, next) => {
  const users = await User.find({
    'roles.isReader': true,
  });
  return res.status(200).json({
    message: 'Reader users fetched successfully',
    data: users,
  });
};
const getUsersWriters = async (req, res, next) => {
  const users = await User.find({
    'roles.isWriter': true,
  });
  return res.status(200).json({
    message: 'Writer users fetched successfully',
    data: users,
  });
};
const getUsersAdmins = async (req, res, next) => {
  const users = await User.find({
    'roles.isAdmin': true,
  });
  return res.status(200).json({
    message: 'Admin users fetched successfully',
    data: users,
  });
};

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
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);
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
  const validPassword = await bcrypt.compare(
    req.body.password,
    user.password);
  if (!validPassword) {
    return res.status(400).json({
      message: 'Invalid password.',
    });
  }
  const token = user.generateAuthToken();
  console.log(`${user.name} logged in successfuly`);
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
      }, // authorization
    },
  });
};

module.exports = {
  getUserById,
  getSearchedUser,
  getUsersReaders,
  getUsersWriters,
  getUsersAdmins,
  signup,
  login,
};
