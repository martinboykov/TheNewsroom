/* eslint-disable no-process-env*/
const { Post } = require('../../models/post');

const { Comment, validateComment } = require('../../models/comment');

const client = require('./../../middleware/redis').client;
const HOST_ADDRESS = process.env.HOST_ADDRESS;

// PUT
const addComment = async (req, res, next) => {
  const comment = req.body;
  // console.log(comment);
  const { error } = validateComment({ content: comment.content });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
    // return res.status(400).json({ message: 'Invalid request data' });
  }

  const newComment = new Comment({
    author: {
      name: comment.author.name,
      _id: comment.author._id,
      avatar: comment.author.avatar,
    },
    content: comment.content,
    postId: comment.postId,
  });
  const addedComment = await newComment.save();
  // console.log(addedComment);
  // { _id: req.params.id, creator: req.user._id },
  // {
  //   $set: {
  //     title: req.body.title,
  //     content: req.body.content,
  //     imagePath: imagePath,
  //   },
  // });
  // const post = await Post.updateOne({ _id: req.params._id },
  //   {
  //     $push: {
  //       comments: addedComment,
  //     },
  //   });
  const postQuery = Post.findOne({ _id: req.params._id });
  const post = await postQuery;
  post.comments.push(addedComment._id);
  post.save();
  const postUpdated = await Post.populate(post, { path: 'comments' });
  // await post.save();
  // console.log(postUpdated);

  const key =
    (HOST_ADDRESS + req.originalUrl || req.url)
      .replace('comment', 'details');
  client.setex(key, 3600, JSON.stringify(postUpdated));
  return res.status(201).json({
    message: 'Comment added successfully to Post',
    data: postUpdated,
  });
};

module.exports = {
  addComment,
};
