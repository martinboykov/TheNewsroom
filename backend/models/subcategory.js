/* eslint-disable no-undefined*/
const mongoose = require('mongoose');

const Joi = require('joi');

const subcategorySchema = new mongoose.Schema({
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
  categoryId: {
    type: mongoose.Schema.Types.ObjectId, // One-to-Many: may need frequent change
    ref: 'Category',
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId, // One-to-Many: may need frequent change
    ref: 'Post',
  }],
  order: {
    type: Number,
    default: 99,
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
});

subcategorySchema.index({ name: 1 }); // schema level

function validateSubcategory(subcategory) {
  const schema = Joi.object({
    name: Joi
      .string()
      .lowercase()
      .min(2)
      .max(20)
      .required(),
    categoryName: Joi
      .string()
      .lowercase()
      .min(2)
      .max(20),
    order: Joi
      .number()
      .min(1)
      .max(99),
    isVisible: Joi
      .boolean(),
  });
  return Joi.validate(subcategory, schema);
}

const Subcategory = mongoose.model('Subcategory', subcategorySchema);

module.exports = {
  Subcategory,
  validateSubcategory,
};
