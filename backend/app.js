/* eslint-disable no-process-env*/

const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const Post = require('./models/post');

const Category = require('./models/category');

const Subcategory = require('./models/subcategory');

const Tag = require('./models/tag');


// mongoose.connect('mongodb+srv://martinboykov:<PASSWORD>@cluster0-ekat5.mongodb.net/test?retryWrites=true')
mongoose.connect(`mongodb+srv://${process.env.MONGO_ATLAS_USER_NAME}:${process.env.MONGO_ATLAS_PASSWORD}@cluster0-ekat5.mongodb.net/test?retryWrites=true`, { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB database...'))
  .catch(() => console.log('Connection to MongoDB failed!'));

app.use(bodyParser.json());

// REMOVE CORSE HEADERS IF NOT REQUIRED IN CASE OF ONE ORIGIN (ONE_APP) DEPLOYMENT
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token');
  next();
});

app.get('/api/categories', async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json({
    message: 'Categories fetched successfully',
    categories: categories,
  });
});
app.post('/api/categories', async (req, res, next) => {
  const category = new Category({ // mongo driver adds _id behind the scene,  before it is saved to MongoDB
    name: req.body.name,
    // subcategories: req.body.subcategories,
  });
  await category.save();
  console.log(category);
  res.status(201).json({
    message: 'Category added successfully', // not neccessary
    categoryId: category._id,
  });
});

// T0D0: TO SEE WHAT IF RECIEVE FROM FRONTEND: newSubcategory?/ newCategoryObj? / newName?
app.put('/api/categories/:_id', async (req, res, next) => {
  const categoryId = req.params._id;
  const category = await Category.findById(categoryId);
  console.log(category);

  // what to modify/update

  const updatedCategory = await category.save();
  console.log(updatedCategory);
  res.status(201).json({
    message: 'Post updated successfully', // not neccessary
    updatedCategory: updatedCategory,
  });
});

app.get('/api/subcategories', async (req, res, next) => {
  const subcategories = await Subcategory.find();
  console.log(subcategories);
  res.status(200).json({
    message: 'Subcategories fetched successfully',
    subcategories: subcategories,
  });
});
app.post('/api/subcategories', async (req, res, next) => {
  const subcategory = new Subcategory({ // mongo driver adds _id behind the scene,  before it is saved to MongoDB
    name: req.body.name,
    categoryId: req.body.categoryId,
  });
  const updateSubcategory = async function() {
    await subcategory.save();
  };
  const updateCategory = async function() {
    const category = await Category.findOne({ _id: req.body.categoryId });
    category.subcategories.push(subcategory._id);
    await category.save();
  };
  Promise.all([updateSubcategory(), updateCategory()]).then(([updatedSubcategory, updatedCategory]) => {
    // await subcategory.save();
    console.log(subcategory);
    res.status(201).json({
      message: 'Subcategory added successfully',
      // subcategoryId: subcategory._id,
      subcategory: updatedSubcategory,
      category: updatedCategory,
    });
  });
});

app.get('/api/posts', async (req, res, next) => {
  const posts = await Post.find();
  console.log(posts);
  res.status(200).json({
    message: 'posts fetched successfully',
    posts: posts,
  });
});

// TOD0: ADDing Transactions in case of fail => no record to db
app.post('/api/posts', async (req, res, next) => {
  // const user = req.user; // T0D0: TO BE SWITCHED LATER (AFTER Authentication/Authorization is complete)
  const user = {
    name: 'Dummy name',
    _id: '111111111111111111111111',
  }; // just for endpoint testing
  // TO CHECK LATER IF CANT GET entire category obj from frontend
  const categoryId = await Category.findOne({ name: req.body.categoryName });

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    author: {
      name: user.name,
      _id: user._id,
    },
    imageMainPath: req.body.imageMainPath,
    categoryId: categoryId,
  });

  if (req.body.tags.length === 0) return res.status(404).json({ message: 'No tags found' });

  const addTags = async function() {
    // adding Tags
    const tags = req.body.tags;
    let index = 0;
    for (const tagName of tags) {
      const tagExisted = await Tag.findOne({ name: tagName });
      if (tagExisted) {
        post.tags.push(tagExisted._id);
        tagExisted.posts.push(post._id);
        await tagExisted.save();
      } else {
        const tag = new Tag({
          name: tagName,
          posts: [post._id],
        });
        await tag.save();
        post.tags.push(tag._id);
      }
      index += 1;
    }
  };
  const updateCategory = async function() {
    const category = await Category.findOne({ name: req.body.categoryName });
    category.posts.push(post._id);
    await category.save();
  };

  await Promise.all([addTags(), updateCategory()]);
  const addedPost = await post.save();
  return res.status(201).json({
    message: 'Post added successfully',
    post: addedPost,
  });
});

module.exports = app;
