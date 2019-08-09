const { Category } = require('../models/category');

const { Post } = require('../models/post');

const { Subcategory, validateSubcategory } = require('../models/subcategory');

const Fawn = require('fawn');

const { client } = require('./../middleware/redis');

const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);

// GET
const getSubcategory = async (req, res, next) => {
  const name = req.params.name;
  const subcategory = await Subcategory.findOne({ name: name })
    .select('-posts');
  if (!subcategory) {
    return res.status(400).json({ message: 'No such subcategory.' });
  }
  return res.status(200).json({
    message: 'Subcategory fetched successfully',
    data: subcategory,
  });
};
const getSubcategoryPostsPartial = async (req, res, next) => {
  const name = req.params.name;
  const subcategory = await Subcategory.findOne({ name: name })
    .select('posts')
    .populate('posts', 'category.name subcategory.name title');
  if (!subcategory) {
    return res.status(400).json({ message: 'No such subcategory.' });
  }
  return res.status(200).json({
    message: 'Subcategory fetched successfully',
    data: subcategory,
  });
};

const getSubcategories = async (req, res, next) => {
  const subcategories = await Subcategory.find({ isVisible: true }).limit(30);
  res.status(200).json({
    message: 'Subcategories fetched successfully',
    data: subcategories,
  });
};

const getSubcategoryPosts = async (req, res, next) => {
  const pageSize = parseInt(req.query.pageSize, 10) || 30;
  const currentPage = parseInt(req.query.page, 10) || 1;
  const subcategoryName = req.params.name;
  const posts = await Post.aggregate([
    { $match: { isVisible: true, 'subcategory.name': subcategoryName } },
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
  if (!posts[0].totalCount[0]) {
    return res.status(404).json({
      message: `No posts found for Subcategory: ${subcategoryName} yet!`,
    });
  }
  if (posts[0].paginatedResults.length === 0) {
    return res.status(404).json({
      message: `Posts are less than the requested`,
    });
  }
  const postsArr = posts[0].paginatedResults;
  const totalPostsCount = posts[0].totalCount[0].count;
  return res.status(200).json({
    message: `Posts for Subcategory with name: ${subcategoryName} fetched successfully`, // eslint-disable-line max-len
    data: {
      posts: postsArr,
      totalPostsCount: totalPostsCount,
    },
  });
};

const getSubcategoryPostsTotalCount = async (req, res, next) => {
  const posts = await Subcategory.aggregate([
    { $match: { name: req.params.name } },
    { $project: { count: { $size: '$posts' } } },
  ]);
  let totalCount;
  if (posts[0]) totalCount = posts[0].count || 0;
  if (!posts[0]) totalCount = 0;
  res.status(200).json({
    message: 'Total posts count fetched successfully',
    data: totalCount,
  });
};

// POST
const addSubcategory = async (req, res, next) => {
  const category = await Category.findOne(
    {
      name: DOMPurify.sanitize(req.body.categoryName),
    });
  if (!category) {
    return res.status(400).json({ message: 'No such category.' });
  }

  const { error } = validateSubcategory(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const ifExists = await Subcategory.findOne({
    name: DOMPurify.sanitize(req.body.name),
  });
  if (ifExists) {
    return res.status(400).json({ message: 'Subcategory already exists.' });
  }

  const newSubcategory = new Subcategory({ // mongo driver adds _id behind the scene,  before it is saved to MongoDB
    name: DOMPurify.sanitize(req.body.name),
    categoryId: category._id,
  });
  if (req.body.order) {
    newSubcategory.order = parseInt(DOMPurify.sanitize(req.body.order), 10);
  }
  if (req.body.isVisible) {
    newSubcategory.isVisible = req.body.isVisible;
  }
  const task = new Fawn.Task(); // eslint-disable-line new-cap
  task.save('subcategories', newSubcategory);
  category.subcategories.push(newSubcategory._id);
  task.update('categories', {
    _id: category._id,
  }, {
      $push: { subcategories: newSubcategory._id },
    });
  return task.run({ useMongoose: true })
    .then(async (result) => {
      // delete entire redis db
      await client.flushdbAsync();

      res.status(200).json({
        message:
          'Subcategory added successfully and Category updated succesfully',
        data: {
          subcategory: result[0],
          category: category,
        },
      });
    })
    .catch((err) => {
      throw new Error(err);
    });
};

// PUT
const updateSubcategory = async (req, res, next) => {
  // const subcategoryId = mongoose.Types.ObjectId(`${req.params._id}`); // eslint-disable-line new-cap
  const subcategory = await Subcategory.findOne({ _id: req.params._id });
  if (!subcategory) {
    return res.status(400).json({ message: 'No such subcategory.' });
  }

  const { error } = validateSubcategory(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const ifExists = await Subcategory.findOne({
    name: DOMPurify.sanitize(req.body.name),
  });
  if (ifExists && subcategory.name !== req.body.name) {
    return res.status(400).json({ message: 'Duplicate subcategory name.' });
  }

  const task = new Fawn.Task(); // eslint-disable-line new-cap
  // subcategory.name = DOMPurify.sanitize(req.body.name);
  const updatedSubcategory = req.body;
  task.update('subcategories', {
    _id: subcategory._id,
  }, {
      $set: {
        name: DOMPurify.sanitize(updatedSubcategory.name),
        order: DOMPurify.sanitize(updatedSubcategory.order),
        isVisible: updatedSubcategory.isVisible,
      },
    });
  // if (subcategory.name !== updatedSubcategory.name) {
  task.update('posts', {
    'subcategory._id': subcategory._id,
  }, {
      $set: {
        'subcategory.name': DOMPurify.sanitize(updatedSubcategory.name),
        isVisible: updatedSubcategory.isVisible,
      },
    }).options({ multi: true });
  // }

  return task.run({ useMongoose: true })
    .then(async (result) => {
      // delete entire redis db
      await client.flushdbAsync();

      res.status(200).json({
        message: 'Subcategory (and Post(s)) updated successfully',
        data: subcategory,
      });
    })
    .catch((err) => {
      throw new Error(err);
    });
};
// DELETE
const deleteSubcategory = async (req, res, next) => {
  const subcategory = await Subcategory.findOne({ _id: req.params._id });
  if (!subcategory) {
    return res.status(400).json({ message: 'No such subcategory.' });
  }
  if (subcategory.posts.length !== 0) {
    return res.status(404).json({
      message: 'Subcategory cannot be deleted',
    });
  }
  const task = new Fawn.Task(); // eslint-disable-line new-cap
  task.update('categories', {
    _id: subcategory.categoryId,
  }, {
      $pull: { subcategories: subcategory._id },
    });
  task.remove(subcategory);
  return task.run({ useMongoose: true })
    .then(async (result) => {
      // delete entire redis db
      await client.flushdbAsync();

      return res.status(201).json({
        message: 'Subcategory deleted successfully',
        subcategory: subcategory,
      });
    })
    .catch((err) => {
      res.status(500).json({ message: 'Something failed.' });
      console.log(err);
    });
};

module.exports = {
  getSubcategory,
  getSubcategoryPostsPartial,
  getSubcategories,
  getSubcategoryPosts,
  getSubcategoryPostsTotalCount,
  addSubcategory,
  updateSubcategory,
  deleteSubcategory,
};
