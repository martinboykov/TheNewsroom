/* eslint new-cap: ["error", { "capIsNew": false }]*/
const { User, validateUser } = require('../models/user');
const bcrypt = require('bcrypt');

const signup = async (req, res, next) => {
  try {
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

    const usersCount = await User.estimatedDocumentCount();
    if (usersCount === 0) user.isAdmin = true;

    // Encrypting the password bofore saving to db
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    await user.save();
    res.status(201).json({
      message: 'User created',
      data: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const login = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status('404').json({
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
    message: 'Login was successful.',
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
