/* eslint-disable no-process-env*/
const { Post } = require('../../models/post');

const { Comment, validateComment } = require('../../models/comment');

const client = require('./../../middleware/redis').client;

const HOST_ADDRESS = process.env.HOST_ADDRESS;

// PUT
const addComment = async (req, res, next) => {
  const _id = req.params._id;
  const comment = req.body;
  const pageSize = parseInt(req.query.pageSize, 10);
  const currentPage = parseInt(req.query.page, 10);
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
  const savedComment = await newComment.save();
  const post = await Post.findOne({ _id: _id });
  post.comments.push(savedComment._id);
  const totalCommentsCount = post.comments.length;
  await post.save();
  const postWithLastComments = await Post.populate(post,
    {
      path: 'comments',
      options: {
        sort: { dateCreated: -1 },
        skip: pageSize * (currentPage - 1),
        limit: pageSize,
      },
    });
  // const commentsToPopulate = post.comments.splice(0, 10); // 10 = comments pageSize
  const comments = await Comment.populate(post.comments,
    {
      path: 'comments',
      options: {
        sort: { dateCreated: -1 },
        limit: 10,
      },
    });
  // const postUpdated = await Post.populate(post,
  //   {
  //     path: 'comments',
  //     options: { sort: 'asc' },
  //   });

  // delete old pages fro redis...
  const pattern = HOST_ADDRESS + '/api/posts/post/comments/' + _id + '*';
  client.keys(pattern, function handleKeys(err, keys) {
    // If there was an error, throw it
    if (err) {
      throw new Error(err);
    }
    // If there are keys, delete them
    if (keys.length) {
      client.del(keys, handleKeys);
      // else return
    } else {
      return;
    }
  });
  // save the current route
  let key = (HOST_ADDRESS + req.originalUrl || req.url);
  // .replace('comments', 'details');
  // set to expire in one day
  client.setex(key, 86400, JSON.stringify({
    message: `Comments fetched successfully by redis`,
    comments,
  }));

  // save first page to redis...
  // from   -> /api/posts/post/comments/:id (current url)
  // using  -> replace 'comment' with 'details'
  // to     -> /api/posts/post/details/:id (where it should be saved in redis)
  // set to expire in one day
  key = (HOST_ADDRESS + req.originalUrl || req.url)
    .replace('comments', 'details');
  client.setex(key, 86400, JSON.stringify({
    post: postWithLastComments,
    totalCommentsCount: totalCommentsCount,
  }));

  return res.status(201).json({
    message: 'Comment added successfully to Post',
    data: {
      comments,
      totalCommentsCount,
    },
  });
};

module.exports = {
  addComment,
};
