const Category = require('../models/category');

const getCategories = async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json({
    message: 'Categories fetched successfully',
    categories: categories,
  });
};

const addCategory = async (req, res, next) => {
  const category = new Category({ // mongo driver adds _id behind the scene,  before it is saved to MongoDB
    name: req.body.name,
    // subcategories: req.body.subcategories,
  });
  await category.save();
  res.status(201).json({
    message: 'Category added successfully', // not neccessary
    category: category,
  });
};

const putRenameCategory = async (req, res, next) => {
  await Category.updateOne(
    // { _id: req.params._id, creator: req.user._id },
    { _id: req.params._id },
    {
      $set: {
        name: req.body.newName,
      },
    });
  res.status(200).json({
    message: 'Category updated successfully',
    newName: req.body.newName,
  });
};

module.exports = {
  getCategories,
  addCategory,
  putRenameCategory,
};
