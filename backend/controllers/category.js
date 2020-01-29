const { Category, validateCategory } = require('../models/category');
const { Post } = require('../models/post');

const Fawn = require('fawn');

const { client } = require('./../middleware/redis');

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
  const categories = await Category.aggregate([
    { $match: { isVisible: true } },
    {
      $project: {
        _id: '$_id',
        subcategories: {
          $cond: {
            if: { $eq: ['$subcategories', null] },
            then: null,
            else: '$subcategories',
          },
        },
        order: '$order',
        name: '$name',
      },
    },
    {
      $unwind: {
        path: '$subcategories',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'subcategories',
        localField: 'subcategories',
        foreignField: '_id',
        as: 'subcategory',
      },
    },
    {
      $project: {
        _id: '$_id',
        order: '$order',
        name: '$name',
        subcategoryId: {
          $cond: {
            if: { $eq: [{ $arrayElemAt: ['$subcategory._id', 0] }, null] },
            then: '$$REMOVE',
            else: { $arrayElemAt: ['$subcategory._id', 0] },
          },
        },
        subCategoryName: {
          $cond: {
            if: { $eq: [{ $arrayElemAt: ['$subcategory.name', 0] }, null] },
            then: '$$REMOVE',
            else: { $arrayElemAt: ['$subcategory.name', 0] },
          },
        },
        subCategoryOrder: {
          $cond: {
            if: {
              $eq: [{
                $convert:
                {
                  input: {
                    $arrayElemAt: ['$subcategory.order', 0],
                  }, to: 'int',
                },
              }, null],
            },
            then: '$$REMOVE',
            else: {
              $convert: {
                input:
                  { $arrayElemAt: ['$subcategory.order', 0] }, to: 'int',
              },
            },
          },
        },
        subcategoryIsVisible: {
          $cond: {
            if: {
              $eq: [{
                $arrayElemAt:
                  ['$subcategory.isVisible', 0],
              }, null],
            },
            then: '$$REMOVE',
            else: { $arrayElemAt: ['$subcategory.isVisible', 0] },
          },
        },
      },
    },
    { $sort: { 'subCategoryOrder': 1 } },
    {
      $group: {
        _id: { _id: '$_id', name: '$name', order: '$order' },
        subcategories: {
          $push: '$subCategoryName',
        },
      },
    },
    {
      $project: {
        _id: '$_id._id',
        name: '$_id.name',
        order: '$_id.order',
        subcategories: '$subcategories',
      },
    },
    { $sort: { 'order': 1 } },

  ]);
  return res.status(200).json({
    message: 'Categories fetched successfully',
    data: categories,
  });
};

const getCategoriesFull = async (req, res, next) => {
  const categories = await Category.find()
    .select('name subcategories order isVisible')
    .sort({ 'order': 1, 'name': 1 })
    .populate({
      path: 'subcategories',
      // match: { isVisible: true },
      select: { name: 1, order: 1, isVisible: 1 },
    });
  if (categories.length === 0) {
    return res.json({
      message: `No categories yet!`,
    });
  }
  categories.forEach((category) => {
    const sortedSubcategories = category.subcategories;
    sortedSubcategories.sort(compare);
    category.subcategories = sortedSubcategories;
  });
  return res.status(200).json({
    message: 'Categories fetched successfully',
    data: categories,
  });
};

const getCategoryPosts = async (req, res, next) => {
  const categoryName = req.params.name;
  const pageSize = parseInt(req.query.pageSize, 10) || 30;
  const currentPage = parseInt(req.query.page, 10) || 1;
  const posts = await Post.aggregate([
    { $match: { isVisible: true, 'category.name': categoryName } },
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
    message: `Posts for Category with name: ${categoryName} fetched successfully`, // eslint-disable-line max-len
    data: {
      posts: postsArr,
      totalPostsCount: totalPostsCount,
    },
  });
};

// for admin -> category posts
const getCategoryPostsPartial = async (req, res, next) => {
  const name = req.params.name;
  const category = await Category.findOne({ name: name })
    .select('posts')
    .populate('posts', 'category.name subcategory.name title isVisible');
  if (!category) {
    return res.status(400).json({ message: 'No such category.' });
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
  let totalCount;
  if (posts[0]) totalCount = posts[0].count || 0;
  if (!posts[0]) totalCount = 0;
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

  // delete entire redis db
  await client.flushdbAsync();

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
    .then(async () => {
      // delete all db
      await client.flushdbAsync();

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

  // delete entire redis db
  await client.flushdbAsync();

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
