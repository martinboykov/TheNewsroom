const { Tag } = require('../models/tag');
const { Post } = require('../models/post');

// GET
const getTags = async (req, res, next) => {
  const query = req.query.namesOnly;
  let tagQuery;
  if (query === 'true') tagQuery = Tag.find().distinct('name');
  if (query !== 'true') tagQuery = Tag.find();
  const tags = await tagQuery;
  res.status(200).json({
    message: 'Tags fetched successfully',
    data: tags,
  });
};

const getTagPosts = async (req, res, next) => {
  const tagName = req.params.name;
  const pageSize = parseInt(req.query.pageSize, 10);
  const currentPage = parseInt(req.query.page, 10);

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
    message: `Posts of Category with name: ${req.params.name} fetched successfully`, // eslint-disable-line max-len
    // data: postAllComments[0].posts,
    data: posts,
  });
};

const getTagPostsTotalCount = async (req, res, next) => {
  const tagPosts = await Tag
    .findOne({ name: req.params.name });
  const totalCount = tagPosts.posts.length;
  res.status(200).json({
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
