const { Post } = require('../../models/post');

// GET
const getPosts = async (req, res, next) => {
  const posts = await Post.find();
  res.status(200).json({
    message: 'Posts fetched successfully',
    data: posts,
  });
};

const getPost = async (req, res, next) => {
  const post = await Post.findOne({ _id: req.params._id });
  if (!post) return res.status(400).json({ message: 'No such post.' });
  return res.status(200).json({
    message: `Post with _id: ${post._id} fetched successfully`,
    data: post,
  });
};

module.exports = {
  getPosts,
  getPost,
};
