const { Post } = require('../../models/post');

const { Category } = require('../../models/category');

const { Subcategory } = require('../../models/subcategory');

const { Tag } = require('../../models/tag');

const Fawn = require('Fawn');

// DELETE
const deletePost = async (req, res, next) => {
  const post = await Post.findOne({ _id: req.params._id });
  if (!post) return res.status(400).json({ message: 'No such post.' });

  const task = new Fawn.Task(); // eslint-disable-line new-cap

  // category update/ remove post
  const categoryPromise = Category
    .findOne({
      name: post.category.name,
    })
    .then((category) => {
      task.update('categories', {
        _id: category._id,
      }, { $pull: { posts: post._id } });
    });

  // subcategory update/ remove post
  let subcategoryPromise;
  if (post.subcategory) {
    subcategoryPromise = Subcategory
      .findOne({
        name: post.subcategory.name,
      })
      .then((subcategory) => {
        task.update('subcategories', {
          _id: subcategory._id,
        }, { $pull: { posts: post._id } });
      });
  }

  // tag update/ add to post
  const tags = [...new Set(post.tags)];
  const tagsPromises = [];
  for (const tag of tags) {
    const tagToRemovePromise = Tag
      .findOne({ name: tag.name })
      .then((tagToRemove) => {
        task.update('tags', {
          _id: tagToRemove._id,
        }, {
            $pull: { posts: post._id },
          });
        if (tagToRemove.posts.length === 1) {
          task.remove(tagToRemove);
        }
      });
    tagsPromises.push(tagToRemovePromise);
  }
  const allPromises = [categoryPromise, subcategoryPromise, ...tagsPromises];
  return Promise.all(allPromises)
    .then(() => {
      // saving new post to db
      task.remove(post);
      return task.run({ useMongoose: true })
        .then((result) => {
          res.status(200).json({
            message:
              'Post (and Tag/s) deleted successfully. Category and Subcategory updated succesfully', // eslint-disable-line max-len
            data: post,
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
  deletePost,
};
