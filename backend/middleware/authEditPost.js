const { Post } = require('../models/post');
// AUTHORIZATION UPDATE DELETE POST
async function authEditPost(req, res, next) {
  try {
    const postId = req.params._id;
    const userId = req.user._id;
    const post = await Post.findOne({ _id: postId });
    if (!post) return res.status(400).json({ message: 'No such post.' });
    if (post.author._id.toString() !== userId.toString()
      && !req.user.roles.isAdmin) {
      return res.status(401).json({
        message: 'Access denied. Unouthorized actions!',
      });
    }
    req.post = post;
    return next();
  } catch (error) {
    return res.status(400).send('Access denied!');
  }
}

module.exports = authEditPost;
