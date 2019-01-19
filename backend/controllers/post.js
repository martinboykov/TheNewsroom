const mongoose = require('mongoose');

const Post = require('../models/post');

const Category = require('../models/category');

const Subcategory = require('../models/subcategory');

const Tag = require('../models/tag');

const Fawn = require('Fawn');

const getPosts = async (req, res, next) => {
  const posts = await Post.find();
  res.status(200).json({
    message: 'posts fetched successfully',
    posts: posts,
  });
};

const addPost = async (req, res, next) => {
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
};

module.exports = {
  getPosts,
  addPost,
};
