/* eslint-disable no-undefined*/
const mongoose = require('mongoose');

const Joi = require('joi');

const commentSchema = new mongoose.Schema({
  // required data
  author: { // One-to-Many with Denornmalization: stays the same almost always
    name: {
      type: String,
      required: true,
    },
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    avatar: {
      type: String,
      required: true,
    },
  },
  content: {
    type: String,
    minlength: 20,
    maxlength: 2000,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
});

function validateComment(comment) {
  const schema = Joi.object({
    content: Joi
      .string()
      .lowercase()
      .min(20)
      .max(2000)
      .required(),
  });

  return Joi.validate(comment, schema);
}

const Comment = mongoose.model('Comment', commentSchema);

module.exports = {
  Comment,
  validateComment,
};
