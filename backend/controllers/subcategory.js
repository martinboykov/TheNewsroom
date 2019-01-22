const mongoose = require('mongoose');

const Category = require('../models/category');

const Subcategory = require('../models/subcategory');

const Fawn = require('Fawn');

// GET
const getSubcategories = async (req, res, next) => {
  const subcategories = await Subcategory.find();
  res.status(200).json({
    message: 'Subcategories fetched successfully',
    subcategories: subcategories,
  });
};

// POST
const addSubcategory = async (req, res, next) => {
  const category = await Category.findOne({ name: req.body.categoryName });
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
  task.run({ useMongoose: true })
    .then((result) => {
      res.status(200).json({
        message:
          'Subcategory added successfully and Category updated succesfully',
        subcategory: newSubcategory,
        // category: category,
      });
    })
    .catch((err) => {
      res.status(500).json({ message: 'Something failed.' });
      console.log(err);
    });
};

// PUT
const renameSubcategory = async (req, res, next) => {
  // const subcategoryId = mongoose.Types.ObjectId(`${req.params._id}`); // eslint-disable-line new-cap
  const subcategory = await Subcategory.findOne({ _id: req.params._id });
  const task = new Fawn.Task(); // eslint-disable-line new-cap
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
  task.run({ useMongoose: true })
    .then(() => {
      res.status(200).json({
        message: 'Subcategory (and Post(s)) updated successfully',
        newName: req.body.newName,
      });
    })
    .catch((err) => {
      res.status(500).json({ message: 'Something failed.' });
      console.log(err);
    });

  // DELETE
  // ...
};

module.exports = {
  getSubcategories,
  addSubcategory,
  renameSubcategory,
};
