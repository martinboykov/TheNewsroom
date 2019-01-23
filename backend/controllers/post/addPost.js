const Post = require('../../models/post');

const Category = require('../../models/category');

const Subcategory = require('../../models/subcategory');

const Tag = require('../../models/tag');

const Fawn = require('Fawn');

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
  const categoryPromise = Category
    .findOne({ name: req.body.categoryName })
    .then((category) => {
      task.update('categories', {
        _id: category._id,
      }, { $push: { posts: post._id } });
      post.category = { name: category.name, _id: category._id };
    });


  // subcategory update/ add to post
  let subcategoryPromise;
  if (req.body.subcategoryName) {
    subcategoryPromise = Subcategory
      .findOne({ name: req.body.subcategoryName })
      .then((subcategory) => {
        task.update('subcategories', {
          _id: subcategory._id,
        }, { $push: { posts: post._id } });

        post.subcategory = { name: subcategory.name, _id: subcategory._id };
      });
  }

  // tag update/ add to post
  const tags = [...new Set(req.body.tags)];
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

  const promises = [categoryPromise, subcategoryPromise, ...tagsPromises];
  await Promise.all(promises);
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

module.exports = {
  addPost,
};
