/* eslint-disable no-process-env*/

const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const Post = require('./models/post');

const Category = require('./models/category');

const Subcategory = require('./models/subcategory');

const Tag = require('./models/tag');

const Fawn = require('Fawn');
Fawn.init(mongoose);


/* eslint-disable no-max-len*/
mongoose.connect(`mongodb+srv://${process.env.MONGO_ATLAS_USER_NAME}:${process.env.MONGO_ATLAS_PASSWORD}@cluster0-ekat5.mongodb.net/test?retryWrites=true`, { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB database...'))
  .catch((err) => console.log('Connection to MongoDB failed!', err));

app.use(bodyParser.json());

// REMOVE CORSE HEADERS IF NOT REQUIRED IN CASE OF ONE ORIGIN (ONE_APP) DEPLOYMENT
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token'); // eslint-disable-line max-len
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
  res.status(201).json({
    message: 'Category added successfully', // not neccessary
    categoryId: category._id,
  });
});

// T0D0: TO SEE WHAT IF RECIEVE FROM FRONTEND: newSubcategory?/ newCategoryObj? / newName?
app.put('/api/categories/:_id', async (req, res, next) => {
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
});

app.get('/api/subcategories', async (req, res, next) => {
  const subcategories = await Subcategory.find();
  res.status(200).json({
    message: 'Subcategories fetched successfully',
    subcategories: subcategories,
  });
});

app.post('/api/subcategories', async (req, res, next) => {
  const newSubcategory = new Subcategory({ // mongo driver adds _id behind the scene,  before it is saved to MongoDB
    name: req.body.name,
    categoryId: req.body.categoryId,
  });

  const task = new Fawn.Task(); // eslint-disable-line new-cap
  task.save('subcategories', newSubcategory);
  const category = await Category.findOne({ _id: req.body.categoryId });
  category.subcategories.push(newSubcategory._id);

  task.update('categories', {
    _id: category._id,
  }, {
      $push: { subcategories: newSubcategory._id },
    });

  task.run()
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
});

app.get('/api/posts', async (req, res, next) => {
  const posts = await Post.find();
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

  if (req.body.tags.length === 0) {
    return res.status(404).json({ message: 'No tags found' });
  }
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    author: {
      name: user.name,
      _id: user._id,
    },
    imageMainPath: req.body.imageMainPath,
  });
  // TO CHECK LATER IF CANT GET entire category obj from frontend
  const task = new Fawn.Task(); // eslint-disable-line new-cap

  // category update/ add to post
  const category = await Category
    .findOne({ name: req.body.categoryName });

  task.update('categories', {
    _id: category._id,
  }, { $push: { posts: post._id } });

  post.categoryId = category._id;

  // subcategory update/ add to post
  if (req.body.subcategoryName) {
    const subcategory = await Subcategory
      .findOne({ name: req.body.subcategoryName });
    task.update('subcategories', {
      _id: subcategory._id,
    }, { $push: { posts: post._id } });

    post.subcategoryId = subcategory._id;
  }

  // tag update/ add to post
  const tags = [...new Set(req.body.tags)];
  for (const tagName of tags) {
    const tagExisted = await Tag.findOne({ name: tagName });
    if (tagExisted) {
      post.tags.push(tagExisted._id);
      task.update('tags', {
        _id: tagExisted._id,
      }, {
          $addToSet: { posts: post._id },
        });
    } else {
      const tag = new Tag({
        name: tagName,
        posts: [post._id],
      });
      task.save('tags', tag);
      post.tags.push(tag._id);
    }
  }

  // saving new post to db
  task.save('posts', post);

  return task.run()
    .then((result) => {
      res.status(200).json({
        message:
          'Post and Tag(s) added successfully. Category and Subcategory updated succesfully', // eslint-disable-line max-len
        post: post,
      });
    })
    .catch((err) => {
      res.status(500).json({ message: 'Something failed.' });
      console.log(err);
    });
});

module.exports = app;
