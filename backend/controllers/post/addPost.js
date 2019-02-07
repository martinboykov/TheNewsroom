const { Post, validatePost } = require('../../models/post');

const { Category } = require('../../models/category');

const { Subcategory } = require('../../models/subcategory');

const { Tag } = require('../../models/tag');

const Fawn = require('Fawn');

// POST
const addPost = async (req, res, next) => {
  // const user = req.user; // T0D0: TO BE SWITCHED LATER (AFTER Authentication/Authorization is complete)
  const user = {
    name: 'Dummy name',
    _id: '111111111111111111111111',
  }; // just for endpoint testing
  const data = req.body;
  const { error } = validatePost(data);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
    // return res.status(400).json({ message: 'Invalid request data' });
  }

  const post = new Post({
    title: data.title,
    content: data.content,
    author: {
      name: user.name,
      _id: user._id,
    },
    imageMainPath: data.imageMainPath,
  });

  const task = new Fawn.Task(); // eslint-disable-line new-cap

  // category update/ add to post
  const categoryPromise = Category
    .findOne({ name: data.categoryName })
    .then((category) => {
      post.category = { name: category.name, _id: category._id };
      task.update('categories', {
        _id: category._id,
      }, { $push: { posts: post._id } });
    });

  // subcategory update/ add to post
  let subcategoryPromise;
  if (data.subcategoryName) {
    subcategoryPromise = Subcategory
      .findOne({ name: data.subcategoryName })
      .then((subcategory) => {
        task.update('subcategories', {
          _id: subcategory._id,
        }, { $push: { posts: post._id } });

        post.subcategory = { name: subcategory.name, _id: subcategory._id };
      });
  }

  // tag update/ add to post
  const tags = [...new Set(data.tags)];
  const tagsPromises = [];
  for (const tagName of tags) {
    const tagExistedPromise = Tag
      .findOne({ name: tagName })
      .then((tagExisted) => {
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
      });
    tagsPromises.push(tagExistedPromise);
  }

  const allPromises = [categoryPromise, subcategoryPromise, ...tagsPromises];

  return Promise.all(allPromises)
    .then(() => {
      // saving new post to db
      task.save('posts', post);
      return task.run({ useMongoose: true })
        .then((result) => {
          res.status(200).json({
            message:
              'Post and Tag(s) added successfully. Category and Subcategory updated succesfully', // eslint-disable-line max-len
            data: result[result.length - 1],
          });
        })
        .catch((err) => {
          throw new Error(err);
        });
    })
    .catch((err) => {
      return res.status(400).json({
        message: 'Invalid request data.',
      });
    });
};

module.exports = {
  addPost,
};