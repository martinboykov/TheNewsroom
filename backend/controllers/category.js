const { Category, validateCategory } = require('../models/category');
const { Post } = require('../models/post');

const Fawn = require('Fawn');

const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);

function compare(a, b) {
  if (a.order > b.order) {
    return 1;
  }
  if (a.order < b.order) {
    return -1;
  }
  return 0;
}

// GET
const getCategory = async (req, res, next) => {
  const name = req.params.name;
  const category = await Category.findOne({ name: name })
    .select('name subcategories order isVisible');
  if (!category) return res.status(400).json({ message: 'No such category.' });
  return res.status(200).json({
    message: 'Category fetched successfully',
    data: category,
  });
};

const getCategories = async (req, res, next) => {
  const categories = await Category.find({ isVisible: true })
    .select('name subcategories order isVisible')
    .sort({ 'order': 1, 'name': 1 })
    .populate('subcategories', 'name order isVisible');
  categories.forEach((category) => {
    const sortedSubcategories = category.subcategories
      .filter((x) => x.isVisible === true);
    sortedSubcategories.sort(compare);
    category.subcategories = sortedSubcategories;
  });
  res.status(200).json({
    message: 'Categories fetched successfully',
    data: categories,
  });
};

const getCategoriesFull = async (req, res, next) => {
  const categories = await Category.find()
    .select('name subcategories order isVisible')
    .sort({ 'order': 1, 'name': 1 })
    .populate('subcategories', 'name order isVisible');
  categories.forEach((category) => {
    const sortedSubcategories = category.subcategories;
    sortedSubcategories.sort(compare);
    category.subcategories = sortedSubcategories;
  });
  res.status(200).json({
    message: 'Categories fetched successfully',
    data: categories,
  });
};

const getCategoryPosts = async (req, res, next) => {
  const categoryName = req.params.name;
  const pageSize = parseInt(req.query.pageSize, 10);
  const currentPage = parseInt(req.query.page, 10);

  const postQuery = Post.find({
    'category.name': categoryName,
    isVisible: true,
  });
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
    content = content.substring(0, 1000);
    post.content = content;
    return post;
  });

  res.status(200).json({
    message: `Posts of Category with name: ${req.params.name} fetched successfully`, // eslint-disable-line max-len
    data: posts,
  });
};

// for admin -> category posts
const getCategoryPostsPartial = async (req, res, next) => {
  const name = req.params.name;
  const category = await Category.findOne({ name: name })
    .select('posts')
    .populate('posts', 'category.name subcategory.name title isVisible');
  console.log(category);
  if (!category) {
    return res.status(400).json({ message: 'No such subcategory.' });
  }
  return res.status(200).json({
    message: 'Subcategory fetched successfully',
    data: category,
  });
};

const getCategoryPostsTotalCount = async (req, res, next) => {
  const posts = await Category.aggregate([
    { $match: { name: req.params.name } },
    { $project: { count: { $size: '$posts' } } },
  ]);
  const totalCount = posts[0].count;
  // const categoryPosts = await Category
  //   .findOne({ name: req.params.name });
  // const totalCount = categoryPosts.posts.length;
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
  if (req.body.order) category.order = req.body.order;
  if (req.body.isVisible) category.isVisible = req.body.isVisible;

  await category.save();
  return res.status(201).json({
    message: 'Category added successfully',
    data: category,
  });
};

// PUT
const updateCategory = async (req, res, next) => {
  const _id = DOMPurify.sanitize(req.params._id);
  const category = await Category.findOne({ _id: _id });
  if (!category) {
    return res.status(400).json({ message: 'No such category.' });
  }
  const ifExists = await Category.findOne({
    name: DOMPurify.sanitize(req.body.newName),
  });
  if (ifExists) {
    return res.status(400).json({ message: 'Duplicate category name.' });
  }
  const updatedCategory = req.body;
  const { error } = validateCategory({
    name: updatedCategory.name,
    order: updatedCategory.order,
    isVisible: updatedCategory.isVisible,
  });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const task = new Fawn.Task(); // eslint-disable-line new-cap

  task.update('categories', {
    _id: category._id,
  }, {
      $set: {
        name: DOMPurify.sanitize(updatedCategory.name),
        order: parseInt(DOMPurify.sanitize(updatedCategory.order), 10),
        isVisible: updatedCategory.isVisible,
      },
    });

  // category.name = updatedCategory.name;

  // if (category.name !== updatedCategory.name) {
  task.update('posts', {
    'category._id': category._id,
  }, {
      $set: {
        'category.name': DOMPurify.sanitize(updatedCategory.name),
        isVisible: updatedCategory.isVisible,
      },
    }).options({ multi: true });
  // }

  task.update('subcategories', {
    categoryId: category._id,
  }, {
      $set: {
        isVisible: updatedCategory.isVisible,
      },
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
  getCategory,
  getCategories,
  getCategoriesFull,
  getCategoryPosts,
  getCategoryPostsPartial,
  getCategoryPostsTotalCount,
  addCategory,
  updateCategory,
  deleteCategory,
};
