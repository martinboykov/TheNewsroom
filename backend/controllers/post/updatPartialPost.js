/* eslint-disable no-process-env*/
const HOST_ADDRESS = process.env.HOST_ADDRESS;

const { Post } = require('../../models/post');

const { Comment, validateComment } = require('../../models/comment');

const client = require('./../../middleware/redis').client;

// PUT
const popularityIncrease = async (req, res, next) => {
  const _id = req.params._id;
  const post = await Post.findOneAndUpdate(
    { _id: _id },
    { $inc: { popularity: 1 } },
    { new: true },
  );

  return res.status(201).json({
    message: 'Post popularity updated successfully',
    data: post,
  });
};


const addComment = async (req, res, next) => {
  const _id = req.params._id;
  const comment = req.body;
  const pageSize = parseInt(req.query.pageSize, 10) || 10;
  const { error } = validateComment({ content: comment.content });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
    // return res.status(400).json({ message: 'Invalid request data' });
  }

  // creating new Comment
  const newComment = createNewComment(comment);

  // saving new Comment to mongodb
  const savedComment = await newComment.save();

  // adding the new Comment to current Post and save to mongodb
  const post = await Post.findOne({ _id: _id });
  post.comments.push(savedComment._id);
  const totalCommentsCount = post.comments.length;
  await post.save();

  // getiing current Post with populated comments
  const postWithCommentsPopulated = await Post.populate(post,
    {
      path: 'comments',
      options: {
        sort: { dateCreated: -1 },
      },
    });

  // delete old comments pages from redis... (outdated)
  const baseUrl = HOST_ADDRESS + '/api/posts/post/comments/' + _id;
  const patternComments = baseUrl + '*'; // eslint-disable-line max-len
  const keysComments = await client.keysAsync(patternComments);
  await client.delAsync(keysComments);


  // restores redis db for all comments in the Post
  const commentsAllPopulated = postWithCommentsPopulated.comments;
  restoreRedisDbComments(commentsAllPopulated, pageSize, baseUrl);

  // delete old Post details page from redis... (outdated) and restores with the new cooments for first cooments page
  const commentsFirstPage =
    postWithCommentsPopulated.comments.slice(0, pageSize);
  postWithCommentsPopulated.comments = commentsFirstPage;
  const patternPost = HOST_ADDRESS + '/api/posts/post/details/' + _id + '*';
  const keyPost = (await client.keysAsync(patternPost))[0]; // only one as there is only one post with _id.....
  if (keyPost) {
    // delets the outdated key for .../api/posts/post/details/...
    await client.delAsync(keyPost);
    // sets new key with the current date
    await client.setexAsync(
      keyPost, 86400, JSON.stringify({
        post: postWithCommentsPopulated,
        totalCommentsCount: totalCommentsCount,
      }));
  }

  return res.status(201).json({
    message: 'Comment added successfully to Post',
    data: {
      commentsFirstPage,
      totalCommentsCount,
    },
  });
};

module.exports = {
  addComment,
  popularityIncrease,
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

async function restoreRedisDbComments(commentsAll, pageSize, baseUrl) {
  let page = 1;
  while (commentsAll.length > 0) {
    const comments = (commentsAll.slice(0, pageSize));
    await client.setexAsync(
      baseUrl + `?pageSize=${pageSize}&page=${page}`,
      86400,
      JSON.stringify(comments),
    );
    page += 1;
    commentsAll.splice(0, pageSize);
  }
}
