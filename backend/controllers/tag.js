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
  const pageSize = parseInt(req.query.pageSize, 10) || 30;
  const currentPage = parseInt(req.query.page, 10) || 1;
  const posts = await Post.aggregate([
    { $match: { isVisible: true, tags: { $elemMatch: { name: tagName } } } },
    {
      $facet: {
        paginatedResults: [
          {
            $project: {
              _id: 1, title: 1, 'content': { $substr: ['$content', 0, 1000] },
              category: 1, subcategory: 1, dateCreated: 1,
              author: 1, imageMainPath: 1,
            },
          },
          { $sort: { dateCreated: -1 } },
          { $limit: pageSize * (currentPage - 1) + pageSize },
          { $skip: pageSize * (currentPage - 1) }],
        totalCount: [
          { $count: 'count' }],
      },
    },
  ]);

  let postsArr;
  let totalPostsCount;
  if (!posts[0].totalCount[0]) totalPostsCount = 0;
  else totalPostsCount = posts[0].totalCount[0].count;
  if (posts[0].paginatedResults.length === 0) postsArr = [];
  else postsArr = posts[0].paginatedResults;

  return res.status(200).json({
    message: `Posts for Tag with name: ${tagName} fetched successfully`, // eslint-disable-line max-len
    data: {
      posts: postsArr,
      totalPostsCount: totalPostsCount,
    },
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
