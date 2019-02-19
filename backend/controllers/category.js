const { Category, validateCategory } = require('../models/category');
const { Post } = require('../models/post');

const Fawn = require('Fawn');

// GET
const getCategories = async (req, res, next) => {
  const categories = await Category.find()
    // .select('name subcategories posts')
    .populate('subcategories', 'name')
    .populate('posts', 'title');
  res.status(200).json({
    message: 'Categories fetched successfully',
    data: categories,
  });
};

// not required, as getCategories populates all subcategories names
const getCategorySubcategories = async (req, res, next) => {
  const subcategories = await Category
    .findOne({ _id: req.params._id })
    .select('subcategories')
    .populate('subcategories', 'name');
  res.status(200).json({
    message: `Subcategories of Category with _id: ${req.params._id} fetched successfully`, // eslint-disable-line max-len
    data: subcategories,
  });
};

const getCategoryPosts = async (req, res, next) => {
  const categoryName = req.params.name;
  const pageSize = parseInt(req.query.pageSize, 10);
  const currentPage = parseInt(req.query.page, 10);
  let posts = await Category.aggregate([
    { $match: { name: categoryName } },

    { $unwind: '$posts' },
    {
      $sort: {
        'posts': -1,
      },
    },
    { $skip: pageSize * (currentPage - 1) },
    { $limit: pageSize },
    { $group: { _id: 1, posts: { $push: { post: '$posts' } } } },
    {
      $project: { posts: '$posts', '_id': 0 },
    },
  ]);
  posts = await Post.populate(posts, {
    path: 'posts.post',
    select: '_id title content category dateCreated author imageMainPath',
    options: { sort: { 'dateCreated': -1 } },
  });
  if (!posts[0]) {
    posts = [];
  } else {
    posts = posts[0].posts.reduce((total, current) => {
      total.push(current.post);
      return total;
    }, []);
  }

  res.status(200).json({
    message: `Posts of Category with name: ${req.params.name} fetched successfully`, // eslint-disable-line max-len
    data: posts,
  });
};

const getCategoryPostsTotalCount = async (req, res, next) => {
  const categoryPosts = await Category
    .findOne({ name: req.params.name });
  const totalCount = categoryPosts.posts.length;
  res.status(200).json({
    message: 'Total posts count fetched successfully',
    data: totalCount,
  });
};

// POST
const addCategory = async (req, res, next) => {
  const ifExists = await Category.findOne({ name: req.body.name });
  if (ifExists) {
    return res.status(400).json({ message: 'Category already exists.' });
  }

  const { error } = validateCategory(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const category = new Category({
    name: req.body.name,
  });

  await category.save();
  return res.status(201).json({
    message: 'Category added successfully',
    data: category,
  });
};

// PUT
const renameCategory = async (req, res, next) => {
  const category = await Category.findOne({ _id: req.params._id });
  if (!category) {
    return res.status(400).json({ message: 'No such category.' });
  }
  if (category.name === req.body.newName) {
    return res.status(400).json({
      message: 'Same category name. Must provide different name.',
    });
  }
  const ifExists = await Category.findOne({ name: req.body.newName });
  if (ifExists) {
    return res.status(400).json({ message: 'Duplicate category name.' });
  }

  const { error } = validateCategory({ name: req.body.newName });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const task = new Fawn.Task(); // eslint-disable-line new-cap

  task.update('categories', {
    _id: category._id,
  }, {
      $set: { name: req.body.newName },
    });

  category.name = req.body.newName;

  task.update('posts', {
    'category._id': category._id,
  }, {
      $set: { 'category.name': req.body.newName },
    }).options({ multi: true });

  return task.run({ useMongoose: true })
    .then(() => {
      res.status(200).json({
        message: 'Category (and Post(s)) updated successfully',
        data: category,
      });
    })
    .catch((err) => {
      throw new Error(err);
    });
};

// DELETE
const deleteCategory = async (req, res, next) => {
  const category = await Category.findOne({ _id: req.params._id });
  if (!category) return res.status(400).json({ message: 'No such category.' });
  if (category.subcategories.length !== 0 || category.posts.length !== 0) {
    return res.status(404).json({
      message: 'Category cannot be deleted',
    });
  }
  const categoryRemoved = await category.remove();
  return res.status(201).json({
    message: 'Category deleted successfully',
    data: categoryRemoved,
  });
};

module.exports = {
  getCategories,
  getCategorySubcategories,
  getCategoryPosts,
  getCategoryPostsTotalCount,
  addCategory,
  renameCategory,
  deleteCategory,
};
