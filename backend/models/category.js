/* eslint-disable no-undefined*/
const mongoose = require('mongoose');

const Joi = require('joi');

const categorySchema = new mongoose.Schema({
  // required data
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 20,
    lowercase: true,
    trim: true,
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
  order: {
    type: Number,
    min: 1,
    max: 99,
    default: 99,
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
});

categorySchema.index({ name: 1 }); // schema level

function validateCategory(category) {
  const schema = Joi.object({
    name: Joi
      .string()
      .lowercase()
      .min(2)
      .max(20)
      .required(),
    order: Joi
      .number()
      .min(1)
      .max(99),
    isVisible: Joi
      .boolean(),
  });

  return Joi.validate(category, schema);
}

const Category = mongoose.model('Category', categorySchema);

module.exports = {
  Category,
  validateCategory,
};
