/* eslint-disable no-process-env*/
const HOST_ADDRESS = process.env.HOST_ADDRESS;

const { Post } = require('../../models/post');

const { Comment, validateComment } = require('../../models/comment');

const client = require('./../../middleware/redis').client;

// PUT
const addComment = async (req, res, next) => {
  const _id = req.params._id;
  const comment = req.body;
  const pageSize = parseInt(req.query.pageSize, 10) || 10;
  const currentPage = parseInt(req.query.page, 10) || 1;
  const { error } = validateComment({ content: comment.content });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
    // return res.status(400).json({ message: 'Invalid request data' });
  }

  // creating new Comment
  const newComment = createNewComment(comment);
  // saving new Comment to mongodb
  const savedComment = await newComment.save();
  // Adding the new Comment to Post
  const post = await Post.findOne({ _id: _id });
  post.comments.push(savedComment._id);
  const totalCommentsCount = post.comments.length;
  // save to mongodb
  await post.save();

  // populate last 10 (pageSize) comments
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
  // delete old pages from redis... (oldDated)
  const patternComments = HOST_ADDRESS + '/api/posts/post/comments/' + _id + '*'; // eslint-disable-line max-len
  const keysComments = await client.keysAsync(patternComments);
  if (keysComments.length > 0) {
    await client.delAsync(keysComments);
    await client.setexAsync(
      keysComments[keysComments.length - 1],
      86400,
      JSON.stringify(postWithLastComments),
    );
  }
  const patternPost = HOST_ADDRESS + '/api/posts/post/details/' + _id + '*';
  const keyPost = (await client.keysAsync(patternPost))[0]; // only one as there is only one post with _id.....
  if (keyPost) {
    await client.delAsync(keyPost);
    await client.setexAsync(
      keyPost, 86400, JSON.stringify({
        post: postWithLastComments,
        totalCommentsCount: totalCommentsCount,
      }));
  }

  // save the current route to redis
  // let key = (HOST_ADDRESS + req.originalUrl || req.url);
  // // .replace('comments', 'details');
  // set to expire in one day
  // client.setex(keyPost, 86400, JSON.stringify({
  //   message: `Comments fetched successfully by redis`,
  //   comments,
  // }));

  // save first page to redis...
  // from   -> /api/posts/post/comments/:id (current url)
  // using  -> replace 'comment' with 'details'
  // to     -> /api/posts/post/details/:id (where it should be saved in redis)
  // set to expire in one day
  // key = (HOST_ADDRESS + req.originalUrl || req.url)
  //   .replace('comments', 'details');
  // client.setex(key, 86400, JSON.stringify({
  //   post: postWithLastComments,
  //   totalCommentsCount: totalCommentsCount,
  // }));

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

function createNewComment(comment) {
  const newComment = new Comment({
    author: {
      name: comment.author.name,
      _id: comment.author._id,
      avatar: comment.author.avatar,
    },
    content: comment.content,
    postId: comment.postId,
  });
  return newComment;
}
