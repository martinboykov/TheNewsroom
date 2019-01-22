const mongoose = require('mongoose');

const Tag = require('../models/tag');

const Fawn = require('Fawn');

// GET
const getTags = async (req, res, next) => {
  const tags = await Tag.find();
  res.status(200).json({
    message: 'Tags fetched successfully',
    tags: tags,
  });
};

const getTagPosts = async (req, res, next) => {
  const posts = await Tag
    .find({ _id: req.params._id })
    // .select('posts -_id')
    .populate('posts');
  res.status(200).json({
    message: `Posts with tag.id=${req.params._id} fetched successfully.`,
    posts: posts,
  });
};

// PUT
// ...

// DELETE
// ...

module.exports = {
  getTags,
  getTagPosts,
};
