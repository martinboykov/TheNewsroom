/* eslint-disable no-undefined*/
const mongoose = require('mongoose');

const Joi = require('joi');

const tagSchema = new mongoose.Schema({
  // required data
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    minlength: 2,
    maxlength: 25,
    trim: true,
  },
  posts: {
    type: [{
      type: mongoose.Schema.Types.ObjectId, // One-to-Many: may need frequent change
      ref: 'Post',
    }],
    // default: undefined, // check if neccessary
    required: true,
  },
});

tagSchema.index({ name: 1 }); // schema level

function validateTag(tag) {
  const schema = Joi.object({
    name: Joi
      .string()
      .lowercase()
      .min(2)
      .max(25)
      .required(),
  });
  return Joi.validate(tag, schema);
}

const Tag = mongoose.model('Tag', tagSchema);

module.exports = {
  Tag,
  validateTag,
};
