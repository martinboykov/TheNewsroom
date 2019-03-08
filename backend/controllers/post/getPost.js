const { Post } = require('../../models/post');

// GET
const getPosts = async (req, res, next) => {
  const pageSize = parseInt(req.query.pageSize, 10) || 10;
  const currentPage = parseInt(req.query.page, 10) || 1;
  const postQuery = Post.find();
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  const posts = await postQuery
    .select(
      '_id title content category subcategory dateCreated author imageMainPath')
    .sort({ 'dateCreated': -1 });

  posts.map((post) => {
    let content = post.content;
    // for eventual HTML post document
    // --------------------------------
    // const el = document.createElement('html');
    // el.innerHTML = content;
    // el.querySelector('.first-paragraph'); // Live NodeList of your anchor elements

    content = content.substring(0, 300); // for now...
    post.content = content;
    return post;
  });
  res.status(200).json({
    message: 'Posts fetched successfully',
    data: posts,
  });
};

const getPostsTotalCount = async (req, res, next) => {
  const postsCount = await Post.countDocuments();
  res.status(200).json({
    message: 'Total posts count fetched successfully',
    data: postsCount,
  });
};

const getPost = async (req, res, next) => {
  const _id = req.params._id;
  const pageSize = parseInt(req.query.pageSize, 10);
  const currentPage = parseInt(req.query.page, 10);
  const post = await Post.findOne({ _id: _id });
  const totalCommentsCount = post.comments.length;
  const postWithLastComments = await Post.populate(post,
    {
      path: 'comments',
      options: {
        sort: { dateCreated: -1 },
        skip: pageSize * (currentPage - 1),
        limit: pageSize,
      },
    });
  if (!post) return res.status(400).json({ message: 'No such post.' });

  return res.status(200).json({
    message: `Post with _id: ${post._id} fetched successfully`,
    data: {
      post: postWithLastComments,
      totalCommentsCount: totalCommentsCount,
    },

  });
};

const getPostComments = async (req, res, next) => {
  const _id = req.params._id;
  const pageSize = parseInt(req.query.pageSize, 10);
  const currentPage = parseInt(req.query.page, 10);
  const post = await Post.findOne({ _id: _id });
  if (!post) return res.status(400).json({ message: 'No such post.' });

  const postPopulatedComments = await Post.populate(post,
    {
      path: 'comments',
      options: {
        sort: { dateCreated: -1 },
        skip: pageSize * (currentPage - 1),
        limit: pageSize,
      },
    });
  const comments = postPopulatedComments.comments;
  return res.status(200).json({
    message: `Comments for page: ${currentPage} of Post with _id:${post._id} fetched successfully`, // eslint-disable-line max-len
    data: comments,
  });
};

const getRelatedPosts = async (req, res, next) => {
  const _id = req.params._id;
  const post = await Post.findOne({
    _id: _id,
  });
  const tags = post.tags.reduce((accumulator, current) => {
    accumulator.push(current._id);
    return accumulator;
  }, []);
  const posts = await Post
    .find({ 'tags._id': [...tags], _id: { $ne: _id } })
    .sort({ 'dateCreated': -1 })
    .limit(5)
    .select(
      '_id title category subcategory');
  return res.status(200).json({
    message:
      `Related posts for Post with _id: ${post._id} fetched successfully`,
    data: posts,
  });
};

const getLatestPosts = async (req, res, next) => {
  const posts = await Post
    .find()
    .limit(6)
    .sort({ 'dateCreated': -1 })
    .select(
      '_id title category subcategory dateCreated author imageMainPath');
  return res.status(200).json({
    message:
      `Latest Posts fetched successfully`,
    data: posts,
  });
};

const getPopularPosts = async (req, res, next) => {
  const dateNow = new Date();
  const daysInPast = 10; // should be 1 day before
  const posts = await Post
    .find({
      dateCreated: {
        $gte: new Date(dateNow.setDate(dateNow.getDate() - daysInPast)),
      },
    })
    .sort({ 'popularity': -1 })
    .limit(6)
    .select(
      '_id title category subcategory dateCreated author imageMainPath popularity'); // eslint-disable-line max-len
  return res.status(200).json({
    message:
      `Latest Posts fetched successfully`,
    data: posts,
  });
};

const getComentedPosts = async (req, res, next) => {
  const dateNow = new Date();
  const daysInPast = 10; // should be 1 day before
  const posts = await Post.aggregate([
    {
      $match: {
        'dateCreated': {
          $gte: new Date(dateNow.setDate(dateNow.getDate() - daysInPast)),
        },
      },
    },
    {
      $addFields: {
        comments_count: { $size: { '$ifNull': ['$comments', []] } },
      },
    },
    {
      $sort: { 'comments_count': -1, dateCreated: -1 },
    },
    {
      $limit: 6,
    },
    {
      $project: {
        _id: 1,
        title: 1,
        author: 1,
        category: 1,
        subcategory: 1,
        dateCreated: 1,
        imageMainPath: 1,
        comments_count: 1,
      },
    },

  ]);

  return res.status(200).json({
    message:
      `Latest Posts fetched successfully`,
    data: posts,
  });
};

module.exports = {
  getPosts,
  getPostsTotalCount,
  getPost,
  getPostComments,
  getRelatedPosts,
  getLatestPosts,
  getPopularPosts,
  getComentedPosts,
};
