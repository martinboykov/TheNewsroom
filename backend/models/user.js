/* eslint-disable no-process-env*/
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true); // email.unique gives and deprication error (this is workoround: https://github.com/Automattic/mongoose/issues/6890#issuecomment-416218953)
const Joi = require('joi');
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  roles: {
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isWriter: {
      type: Boolean,
      default: false,
    },
    isReader: {
      type: Boolean,
      default: true,
    },
  },
  avatar: {
    type: String,
    default: '/assets/images/main/posts/details/avatar.svg',
  },
});

userSchema.plugin(uniqueValidator);

userSchema.method({
  generateAuthToken: function() {
    // secret must be aded predeployment with config or process.env.CUSTOM_VARIABLE
    const token =
      jwt.sign(
        {
          _id: this._id,
          name: this.name,
          roles: this.roles,
          avatar: this.avatar,
        },
        JWT_SECRET,
        { expiresIn: '1h' }
      ); // 1 hour duration
    return token;
  },
});

userSchema.index({ email: 1 }); // schema level

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(2).max(30).required(), // alphanumeric characters 2-30
    email: Joi.string().max(255).email({ minDomainAtoms: 2 }), // must have two domain parts e.g. example.com
    password: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/), // alphanumeric characters 6-30
  });

  return Joi.validate(user, schema);
}

const User = mongoose.model('User', userSchema);

module.exports = { User, userSchema, validateUser };
