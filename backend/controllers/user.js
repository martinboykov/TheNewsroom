/* eslint new-cap: ["error", { "capIsNew": false }]*/
const { User, validateUser } = require('../models/user');
const bcrypt = require('bcrypt');

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
    // isAdmin: false, // authorization
  });
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  console.log('AFTER JOI');
  const usersCount = await User.estimatedDocumentCount();
  if (usersCount === 0) user.isAdmin = true;

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
      message: 'Authentication failed',
    });
  }
  const validPassword = await bcrypt.compare(
    req.body.password,
    user.password);
  if (!validPassword) {
    return res.status(400).json({
      message: 'Invalid email or password.',
    });
  }
  const token = user.generateAuthToken();
  console.log(`${user.name} logged in successfuly`);
  return res.status(200).json({
    message: 'Logged in successfuly',
    data: {
      token: token,
      expiresIn: 3600,
      userId: user._id, // authorization
    },
  });
};

module.exports = {
  signup,
  login,
};
