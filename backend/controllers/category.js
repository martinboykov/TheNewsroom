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

// T0D0: TO SEE WHAT IF RECIEVE FROM FRONTEND: newSubcategory?/ newCategoryObj? / newName?
const updateCategory = async (req, res, next) => {
  const categoryId = req.params._id;
  const category = await Category.findById(categoryId);

  // ......
  // what to modify/update
  // ......

  const updatedCategory = await category.save();
  res.status(201).json({
    message: 'Post updated successfully', // not neccessary
    updatedCategory: updatedCategory,
  });
};

module.exports = {
  getCategories,
  addCategory,
  updateCategory,
};
