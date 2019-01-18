/* eslint-disable no-undefined*/
const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  // required data
  name: {
    type: String,
    required: true,
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

module.exports = mongoose.model('Tag', tagSchema);
