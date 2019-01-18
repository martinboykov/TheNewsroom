/* eslint-disable no-undefined*/
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  // required data
  name: {
    type: String,
    required: true,
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

module.exports = mongoose.model('Category', categorySchema);
