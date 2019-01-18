/* eslint-disable no-undefined*/
const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  // required data
  name: {
    type: String,
    required: true,
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

module.exports = mongoose.model('Subcategory', subcategorySchema);
