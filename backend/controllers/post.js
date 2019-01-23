const Post = require('../models/post');

const Category = require('../models/category');

const Subcategory = require('../models/subcategory');

const Tag = require('../models/tag');

const Fawn = require('Fawn');

// GET
const getPosts = async (req, res, next) => {
  const posts = await Post.find();
  res.status(200).json({
    message: 'Posts fetched successfully',
    posts: posts,
  });
};

const getPost = async (req, res, next) => {
  const post = await Post.findOne({ _id: req.params._id });
  res.status(200).json({
    message: `Post with _id: ${post._id} fetched successfully`,
    post: post,
  });
};

// POST
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

  const task = new Fawn.Task(); // eslint-disable-line new-cap

  // category update/ add to post
  const category = await Category
    .findOne({ name: req.body.categoryName });

  task.update('categories', {
    _id: category._id,
  }, { $push: { posts: post._id } });

  post.category = { name: category.name, _id: category._id };

  // subcategory update/ add to post
  if (req.body.subcategoryName) {
    const subcategory = await Subcategory
      .findOne({ name: req.body.subcategoryName });
    task.update('subcategories', {
      _id: subcategory._id,
    }, { $push: { posts: post._id } });

    post.subcategory = { name: subcategory.name, _id: subcategory._id };
  }

  // tag update/ add to post
  const tags = [...new Set(req.body.tags)];
  for (const tagName of tags) {
    const tagExisted = await Tag.findOne({ name: tagName });
    if (tagExisted) {
      post.tags.push({ name: tagExisted.name, _id: tagExisted._id });
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
      post.tags.push({ name: tag.name, _id: tag._id });
    }
  }

  // saving new post to db
  task.save('posts', post);
  return task.run({ useMongoose: true })
    .then((result) => {
      res.status(200).json({
        message:
          'Post and Tag(s) added successfully. Category and Subcategory updated succesfully', // eslint-disable-line max-len
        post: result[result.length - 1],
      });
    })
    .catch((err) => {
      res.status(500).json({ message: 'Something failed.' });
      console.log(err);
    });
};

// PUT
const updatePost = async (req, res, next) => {
  // const user = req.user; // T0D0: TO BE SWITCHED LATER (AFTER Authentication/Authorization is complete)

  // check if the author is the current user

  const oldPost = await Post.findOne({ _id: req.params._id });
  // if such doesnt exists => error

  const updatedPost = oldPost.toObject();

  // Start the transaction
  const task = new Fawn.Task(); // eslint-disable-line new-cap

  // IF IMAGEPATH IS CHANGED
  // task.update(..)

  // IF CATEGORY CHANGED/UNCHANGED
  let categoryPromise;
  if (oldPost.category.name === req.body.categoryName) {
    updatedPost.category = {
      name: oldPost.category.name,
      _id: oldPost.category._id,
    };
  } else {
    categoryPromise = Category
      .findOne({ name: req.body.categoryName });
    categoryPromise
      .then((category) => {
        // removes post_id from old category
        task.update('categories', {
          _id: oldPost.category._id,
        }, { $pull: { posts: oldPost._id } });

        // adds post_id to new category
        task.update('categories', {
          _id: category._id,
        }, { $push: { posts: oldPost._id } });

        updatedPost.category = { name: category.name, _id: category._id };
      });
  }

  // IF SUBCATEGORY CHANGED/UNCHANGED
  let oldSubcategory;
  if (oldPost.subcategory) {
    oldSubcategory = {
      name: oldPost.subcategory.name,
      _id: oldPost.subcategory._id,
    };
  }
  const subcategoryPromise = Subcategory
    .findOne({ name: req.body.subcategoryName || '' });

  subcategoryPromise.then((newSubcategory) => {
    // 1. if no newSubcategory in updatedPost
    if (!newSubcategory) {
      // 1.1. if no oldSubcategory in oldPost exists as well
      // => do nothing

      // 1.2. if oldSubcategory in oldPost exists
      if (oldSubcategory) {
        task.update('subcategories', {
          _id: oldSubcategory._id,
        }, { $pull: { posts: oldPost._id } });
        task.update('posts', {
          _id: updatedPost._id,
        }, { $unset: { subcategory: '' } });
        updatedPost.subcategory = '';
      }
    } else { // 2. if newSubcategory in updatedPost exists
      // 2.1. no oldSubcategory in oldPost exists => must update newSubcategory by adding oldPost._id
      if (!oldSubcategory) {
        task.update('subcategories', {
          _id: newSubcategory._id,
        }, { $push: { posts: updatedPost._id } });
      } else { // if(oldSubcategory)
        if (oldSubcategory.name === newSubcategory.name) {
          // 2.2. oldSubcategory in oldPost exists
          // 2.2.1. oldSubcategory === newSubcategory
          // => do nothing
        } else { // 2.2.2. oldSubcategory !== newSubcategory
          // removes post_id from old subcategory
          task.update('subcategories', {
            _id: oldSubcategory._id,
          }, { $pull: { posts: oldPost._id } });

          // adds post_id to new subcategory
          task.update('subcategories', {
            _id: newSubcategory._id,
          }, { $push: { posts: updatedPost._id } });

          updatedPost.subcategory = {
            name: newSubcategory.name,
            _id: newSubcategory._id,
          };
        }
      }
    }
  });
  // TAG UPDATE
  if (req.body.tags.length === 0) {
    return res.status(404).json({ message: 'No tags found' });
  }

  const newtags = new Set(req.body.tags);
  const oldTags = new Set(oldPost.tags.map((t) => t.name));

  // 1. dIfferent tags in the newTags from oldTags
  const differentTags = [...newtags].filter((item) => {
    return !oldTags.has(item);
  });
  const promisesDifferentTags = [];
  if (differentTags) {
    for (const tagName of differentTags) {
      const differentTagExistsPromise = Tag.findOne({ name: tagName })
        .then((differentTagExists) => {
          if (!differentTagExists) {
            const differentTag = new Tag({
              name: tagName,
              posts: [updatedPost._id],
            });
            task.save(differentTag);
            updatedPost.tags.push(differentTag);
          } else {
            task.update('tags', {
              _id: differentTagExists._id,
            }, {
                $push: { posts: updatedPost._id },
              });
            updatedPost.tags.push(differentTagExists);
          }
        });
      promisesDifferentTags.push(differentTagExistsPromise);
    }
  }

  // 2. Removed tags from oldTags (does not exist in newTags)
  const removedTags = [...oldTags].filter((item) => {
    return !newtags.has(item);
  });
  const promisesRemovedTags = [];
  if (removedTags) {
    for (const tagName of removedTags) {
      const tagToRemovePromise = Tag.findOne({ name: tagName })
        .then((tagToRemove) => {
          const index = updatedPost.tags.findIndex((tag) => {
            return tag.name === tagName;
          });
          updatedPost.tags.splice(index, 1);
          task.update('tags', {
            _id: tagToRemove._id,
          }, {
              $pull: { posts: updatedPost._id },
            });
          if (tagToRemove.posts.length === 1) {
            task.remove(tagToRemove);
          }
        });
      promisesRemovedTags.push(tagToRemovePromise);
    }
  }
  const allPromises = [
    categoryPromise,
    subcategoryPromise,
    ...promisesDifferentTags,
    ...promisesRemovedTags,
  ];
  await Promise.all(allPromises);
  task.update(oldPost, updatedPost)
    .options({ viaSave: true });
  return task.run({ useMongoose: true })
    .then((result) => {
      res.status(200).json({
        message:
          'Post and (Tag(s)) added successfully. Category, Subcategory and Tags updated succesfully', // eslint-disable-line max-len
        post: result[result.length - 1],
      });
    })
    .catch((err) => {
      res.status(500).json({ message: 'Something failed.' });
      console.log(err);
    });
};

// DELETE
// ...

module.exports = {
  getPosts,
  getPost,
  addPost,
  updatePost,
};
