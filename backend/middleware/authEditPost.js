const { Post } = require('../models/post');
// AUTHORIZATION UPDATE DELETE POST
async function authEditPost(req, res, next) {
  try {
    const postId = req.params._id;
    console.log(postId);

    const userId = req.user._id;
    console.log(userId);
    const post = await Post.findOne({ _id: postId });
    console.log(post);
    if (!post) return res.status(400).json({ message: 'No such post.' });

    console.log('----post-----');
    console.log(post);
    console.log('---------');
    console.log('----post.creatorId ?== userId-----');
    console.log(post.author._id.toString() === userId.toString());
    if (post.author._id.toString() !== userId.toString()) {
      return res.status(401).json({
        message: 'Access denied. Unouthorized actions!',
      });
    }
    // if (post.author._id.toString() !== userId.toString() && !req.user.isAdmin) {
    //   return res.status(401).json({ message: 'Access denied. Unouthorized actions!' });
    // }
    req.post = post;
    return next();
  } catch (error) {
    return res.status(400).send('Access denied!');
  }
}

module.exports = authEditPost;
