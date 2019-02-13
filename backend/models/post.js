/* eslint-disable no-undefined*/
const mongoose = require('mongoose');

const Joi = require('joi');

const postSchema = new mongoose.Schema({
  // required data
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 200,
  },
  content: {
    type: String, // T0D0: TO BE CHECKED LATER (HTML editor or not)
    required: true,
    minlength: 200,
    maxlength: 4000,
  },
  author: { // One-to-Many with Denornmalization: stays the same almost always
    name: {
      type: String,
      required: true,
    },
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  imageMainPath: { // to be checked later : mulgter?
    type: String,
    minlength: 1,
    maxlength: 1000,
    required: true,
  },
  category: { // One-to-Many with Denornmalization: faster queries (population)
    name: {
      type: String,
      required: true,
    },
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
  },
  tags: {
    type: [{ // One-to-Many with Denornmalization: faster queries (population)
      name: {
        type: String,
        required: true,
      },
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
        required: true,
      },
    }],
    required: true,
  },
  // not required data
  subcategory: { // One-to-Many with Denornmalization: faster queries (population)
    name: {
      type: String,
    },
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subcategory',
    },
  },
  popularity: {
    type: Number,
    default: 0,
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  imagePaths: {
    type: [String],
    default: undefined,
  },

});

function validatePost(post) {
  const schema = Joi.object({
    title: Joi
      .string()
      .min(1)
      .max(200)
      .required(),
    content: Joi
      .string()
      .min(200)
      .max(4000)
      .required(),
    imageMainPath: Joi // to be checked later : mulgter?
      .string()
      .lowercase()
      .min(1)
      .max(1000)
      .required(),
    categoryName: Joi
      .string()
      .min(1)
      .max(200)
      .required(),
    // subcategoryName: Joi
    //   .string()
    //   .min(1)
    //   .max(200)
    //   .required(),
    tags: [Joi.array()
      .items(Joi
        .string()
        .lowercase()
        .min(1)
        .max(200)
        .required())
      .required(),
    ],
  });

  return Joi.validate(post, schema);
}


module.exports = mongoose.model('Post', postSchema);
const Post = mongoose.model('Post', postSchema);

module.exports = {
  Post,
  validatePost,
};
