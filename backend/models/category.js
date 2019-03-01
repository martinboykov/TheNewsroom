/* eslint-disable no-undefined*/
const mongoose = require('mongoose');

const Joi = require('joi');

const categorySchema = new mongoose.Schema({
  // required data
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 1,
    maxlength: 20,
    lowercase: true,
  },
  // not required data
  subcategories: [{
    type: mongoose.Schema.Types.ObjectId, // One-to-Many: may need frequent change
    ref: 'Subcategory',
  }],
  posts: [{
    type: mongoose.Schema.Types.ObjectId, // One-to-Many: may need frequent change
    ref: 'Post',
  }],
});

function validateCategory(category) {
  const schema = Joi.object({
    name: Joi
      .string()
      .lowercase()
      .min(1)
      .max(20)
      .required(),
  });

  return Joi.validate(category, schema);
}

const Category = mongoose.model('Category', categorySchema);

module.exports = {
  Category,
  validateCategory,
};
