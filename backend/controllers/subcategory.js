const { Category } = require('../models/category');

const { Post } = require('../models/post');

const { Subcategory, validateSubcategory } = require('../models/subcategory');

const Fawn = require('Fawn');

// GET
const getSubcategories = async (req, res, next) => {
  const subcategories = await Subcategory.find();
  res.status(200).json({
    message: 'Subcategories fetched successfully',
    data: subcategories,
  });
};

const getSubcategoryPosts = async (req, res, next) => {
  const subcategoryName = req.params.name;
  const pageSize = parseInt(req.query.pageSize, 10);
  const currentPage = parseInt(req.query.page, 10);
  const postQuery = Post.find({ 'subcategory.name': subcategoryName });
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

    content = content.substring(0, 1000); // for now...
    post.content = content;
    // console.log(post);
    return post;
  });

  res.status(200).json({
    message: `Posts of Subcategory with name: ${req.params.name} fetched successfully`, // eslint-disable-line max-len
    data: posts,
  });
};

const getSubcategoryPostsTotalCount = async (req, res, next) => {
  const subcategoryPosts = await Subcategory
    .findOne({ name: req.params.name });
  const totalCount = subcategoryPosts.posts.length;
  res.status(200).json({
    message: 'Total posts count fetched successfully',
    data: totalCount,
  });
};

// POST
const addSubcategory = async (req, res, next) => {
  const category = await Category.findOne({ name: req.body.categoryName });
  if (!category) {
    return res.status(400).json({ message: 'No such category.' });
  }

  const { error } = validateSubcategory({ name: req.body.name });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const ifExists = await Subcategory.findOne({ name: req.body.name });
  if (ifExists) {
    return res.status(400).json({ message: 'Subcategory already exists.' });
  }

  const newSubcategory = new Subcategory({ // mongo driver adds _id behind the scene,  before it is saved to MongoDB
    name: req.body.name,
    categoryId: category._id,
  });

  const task = new Fawn.Task(); // eslint-disable-line new-cap
  task.save('subcategories', newSubcategory);
  category.subcategories.push(newSubcategory._id);
  task.update('categories', {
    _id: category._id,
  }, {
      $push: { subcategories: newSubcategory._id },
    });
  return task.run({ useMongoose: true })
    .then((result) => {
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
const renameSubcategory = async (req, res, next) => {
  // const subcategoryId = mongoose.Types.ObjectId(`${req.params._id}`); // eslint-disable-line new-cap
  const subcategory = await Subcategory.findOne({ _id: req.params._id });
  if (!subcategory) {
    return res.status(400).json({ message: 'No such subcategory.' });
  }

  const { error } = validateSubcategory({ name: req.body.newName });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  if (subcategory.name === req.body.newName) {
    return res.status(400).json({
      message: 'Same subcategory name. Must provide different name.',
    });
  }
  const ifExists = await Subcategory.findOne({ name: req.body.newName });
  if (ifExists) {
    return res.status(400).json({ message: 'Duplicate subcategory name.' });
  }

  const task = new Fawn.Task(); // eslint-disable-line new-cap
  subcategory.name = req.body.newName;
  task.update('subcategories', {
    _id: subcategory._id,
  }, {
      $set: { name: req.body.newName },
    });
  task.update('posts', {
    'subcategory._id': subcategory._id,
  }, {
      $set: { 'subcategory.name': req.body.newName },
    }).options({ multi: true });
  return task.run({ useMongoose: true })
    .then((result) => {
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
    .then((result) => {
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
  getSubcategories,
  getSubcategoryPosts,
  getSubcategoryPostsTotalCount,
  addSubcategory,
  renameSubcategory,
  deleteSubcategory,
};
