const { Category, validateCategory } = require('../models/category');

const Fawn = require('Fawn');

// GET
const getCategories = async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json({
    message: 'Categories fetched successfully',
    data: categories,
  });
};

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
  const posts = await Category
    .findOne({ _id: req.params._id })
    .select('posts')
    .populate('posts');
  res.status(200).json({
    message: `Posts of Category with _id: ${req.params._id} fetched successfully`, // eslint-disable-line max-len
    data: posts,
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
      res.status(500).json({ message: 'Something failed.' });
      console.log(err);
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
  addCategory,
  renameCategory,
  deleteCategory,
};
