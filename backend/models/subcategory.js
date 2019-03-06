/* eslint-disable no-undefined*/
const mongoose = require('mongoose');

const Joi = require('joi');

const subcategorySchema = new mongoose.Schema({
  // required data
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 1,
    maxlength: 30,
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
});

subcategorySchema.index({ name: 1 }); // schema level

function validateSubcategory(subcategory) {
  const schema = Joi.object({
    name: Joi
      .string()
      .lowercase()
      .min(1)
      .max(30)
      .required(),
  });
  return Joi.validate(subcategory, schema);
}

const Subcategory = mongoose.model('Subcategory', subcategorySchema);

module.exports = {
  Subcategory,
  validateSubcategory,
};
