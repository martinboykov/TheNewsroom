/* eslint-disable no-process-env*/
const HOST_ADDRESS = process.env.HOST_ADDRESS;

const { Post } = require('../../models/post');

const { User } = require('../../models/user');

const { Comment, validateComment } = require('../../models/comment');

const client = require('./../../middleware/redis').client;

// PUT
// -----------------------------------------------------
const popularityIncrease = async (req, res, next) => {
  const _id = req.params._id;
  const post = await Post.findOne(
    { _id: _id },
  );
  // console.log(post);
  if (!post) return res.status(404).json({ message: 'No such post!' });
  post.popularity += 1;
  await post.save();
  // const post = await Post.findOneAndUpdate(
  //   { _id: _id },
  //   { $inc: { popularity: 1 } },
  //   // { new: true },
  // );

  return res.status(201).json({
    message: 'Post popularity updated successfully',
    data: post.popularity,
  });
};

// -----------------------------------------------------
const addComment = async (req, res, next) => {
  const _id = req.params._id;
  const comment = req.body;
  const pageSize = parseInt(req.query.pageSize, 10) || 10;
  const { error } = validateComment({ content: comment.content });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
    // return res.status(400).json({ message: 'Invalid request data' });
  }
  const user = await User.findOne({ _id: comment.author._id });
  if (!user) return res.status(400).json({ message: 'No such user.' });


  const newComment = createNewComment(comment);
  const savedComment = await newComment.save();
  const post = await Post.findOneAndUpdate(
    { _id: _id },
    { $push: { comments: savedComment } },
    { new: true },
  );
  if (!post) return res.status(400).json({ message: 'No such post.' });

  // getiing current Post with populated comments
  const postAllComments = await Post.populate(post,
    {
      path: 'comments',
      options: {
        sort: { dateCreated: -1 },
      },
    });
  const totalCommentsCount = post.comments.length;

  // if there is no connection to redis -> return response directly
  if (client.connected) {
    handleRedisState(_id, postAllComments, pageSize, totalCommentsCount);
  }

  const commentsFirstPage = postAllComments.comments.slice(0, pageSize);
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

async function handleRedisState(_id, allComments, pageSize, totalCount) {
  const baseUrl = HOST_ADDRESS + `/api/posts/${_id}/comments`;
  const patternComments = baseUrl + '*';
  const keysComments = await client.keysAsync(patternComments);
  // delete old comments pages from redis... (outdated)
  if (keysComments.length > 0) await client.delAsync(keysComments);
  // restores redis db for all comments in the Post
  const commentsAll = allComments.comments.slice();
  restoreRedisDbComments(commentsAll, pageSize, baseUrl);

  const patternPost = HOST_ADDRESS + `/api/posts/${_id}/details` + '*';
  const keyPost = (await client.keysAsync(patternPost))[0]; // only one as there is only one post with _id.....
  // delets and restores the outdated key for .../api/posts/post/details/...
  if (keyPost) await client.delAsync(keyPost);
  const postFirstPageComents = allComments;
  postFirstPageComents.comments =
    postFirstPageComents.comments.slice(0, pageSize);
  // restores with the new cooments for first cooments page
  await client.setexAsync(
    keyPost, 86400, JSON.stringify({
      post: postFirstPageComents,
      totalCommentsCount: totalCount,
    }));
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
