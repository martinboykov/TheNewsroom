const { Post } = require('../../models/post');

// GET
const getPosts = async (req, res, next) => {
  const pageSize = parseInt(req.query.pageSize, 10);
  const currentPage = parseInt(req.query.page, 10);
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
    // console.log(post);
    return post;
  });
  res.status(200).json({
    message: 'Posts fetched successfully',
    data: posts,
  });
};

const getTotalCount = async (req, res, next) => {
  const postsCount = await Post.countDocuments();
  console.log(postsCount);
  res.status(200).json({
    message: 'Total posts count fetched successfully',
    data: postsCount,
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

const getRelatedPosts = async (req, res, next) => {
  const _id = req.params._id;
  const category = req.query.category;
  const subcategory = req.query.subcategory;
  const post = await Post.findOne({
    'category.name': category,
    'subcategory.name': subcategory,
    _id: _id,
  });
  const tags = post.tags.reduce((accumulator, current) => {
    accumulator.push(current._id);
    return accumulator;
  }, []);
  console.log(tags);
  const posts = await Post
    .find({ 'tags._id': [...tags] })
    .sort({ 'dateCreated': -1 })
    .limit(5)
    .select(
      '_id title');
  return res.status(200).json({
    message:
      `Related posts for Post with _id: ${post._id} fetched successfully`,
    data: posts,
  });
};

const getLatestPosts = async (req, res, next) => {
  const postsCount = await Post.countDocuments();
  console.log(postsCount);
  const posts = await Post
    .find()
    .limit(5)
    .sort({ 'dateCreated': -1 })
    .select(
      '_id title dateCreated author imageMainPath');
  return res.status(200).json({
    message:
      `Latest Posts fetched successfully`,
    data: posts,
  });
};

const getPopularPosts = async (req, res, next) => {
  const dateNow = new Date();
  const posts = await Post
    .find({
      dateCreated: {
        $gte: new Date(dateNow.setDate(dateNow.getDate() - 1)),
      },
    })
    .sort({ 'popularity': -1 })
    .limit(5)
    .select(
      '_id title dateCreated author imageMainPath popularity');
  return res.status(200).json({
    message:
      `Latest Posts fetched successfully`,
    data: posts,
  });
};

const getComentedPosts = async (req, res, next) => {
  const dateNow = new Date();
  const posts = await Post.aggregate([
    {
      $match: {
        'dateCreated': {
          $gte: new Date(dateNow.setDate(dateNow.getDate() - 1)),
        },
      },
    },
    {
      $addFields: {
        comments_count: { $size: { '$ifNull': ['$comments', []] } },
      },
    },
    {
      $sort: { 'comments_count': 1 },
    },
  ]);
  console.log(posts);
  // .find({
  //   dateCreated: {
  //     $gte: new Date(dateNow.setDate(dateNow.getDate() - 1)),
  //   },
  // })
  // .sort({ 'comments': -1 })
  // .limit(5)
  // .select(
  //   '_id title dateCreated author imageMainPath popularity');
  return res.status(200).json({
    message:
      `Latest Posts fetched successfully`,
    data: posts,
  });
};

module.exports = {
  getPosts,
  getTotalCount,
  getPost,
  getRelatedPosts,
  getLatestPosts,
  getPopularPosts,
  getComentedPosts,
};
