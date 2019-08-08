const { Tag } = require('../models/tag');
const { Post } = require('../models/post');

// GET
const getTags = async (req, res, next) => {
  const queryNamesOnly = req.query.namesOnly;
  const queryName = req.query.name;
  let tagQuery;
  if (queryNamesOnly === 'true' && queryName) {
    tagQuery = Tag.find({
      name: { $regex: queryName },
    }).distinct('name');
  }
  if (queryNamesOnly !== 'true') tagQuery = Tag.find();
  const tags = await tagQuery;
  res.status(200).json({
    message: 'Tags fetched successfully',
    data: tags,
  });
};

const getTagPosts = async (req, res, next) => {
  const tagName = req.params.name;
  const tag = await Tag.findOne({ name: tagName });
  if (!tag) return res.status(404).json({ message: 'No such tag!' });
  const pageSize = parseInt(req.query.pageSize, 10) || 30;
  const currentPage = parseInt(req.query.page, 10) || 1;

  const postsQuery = Post.find({
    tags: { $elemMatch: { name: tagName } },
  });

  if (pageSize && currentPage) {
    postsQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  const posts = await postsQuery
    .select(
      '_id title content category subcategory dateCreated author imageMainPath')
    .sort({ 'dateCreated': -1 });

  posts.map((post) => {
    let content = post.content;
    content = content.substring(0, 1000); // for now...
    post.content = content;
    return post;
  });
  return res.status(200).json({
    message: `Posts of Category with name: ${req.params.name} fetched successfully`, // eslint-disable-line max-len
    // data: postAllComments[0].posts,
    data: posts,
  });
};

const getTagPostsTotalCount = async (req, res, next) => {
  const posts = await Tag.aggregate([
    { $match: { name: req.params.name } },
    { $project: { count: { $size: '$posts' } } },
  ]);
  let totalCount;
  if (posts[0]) totalCount = posts[0].count || 0;
  if (!posts[0]) totalCount = 0;
  // const tagPosts = await Tag
  //   .findOne({ name: req.params.name });
  // if (!tagPosts) return res.status(404).json({ message: 'No such Page!' });
  // const totalCount = tagPosts.posts.length;
  return res.status(200).json({
    message: 'Total posts count fetched successfully',
    data: totalCount,
  });
};

// PUT
// ...

// DELETE
// ...

module.exports = {
  getTags,
  getTagPosts,
  getTagPostsTotalCount,
};
