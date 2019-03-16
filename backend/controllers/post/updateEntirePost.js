const { Post, validatePost } = require('../../models/post');

const { Category } = require('../../models/category');

const { Subcategory } = require('../../models/subcategory');

const { Tag } = require('../../models/tag');

const Fawn = require('Fawn');

const deleteImg = require('../../middleware/image').deleteImg;

// PUT
const updatePost = async (req, res, next) => {
  // const user = req.user; // T0D0: TO BE SWITCHED LATER (AFTER Authentication/Authorization is complete)
  // ...

  // check if the author is the current user
  // ....

  const data = req.body;


  // set tags
  const parsedTags = JSON.parse(data.tags); // as they are in from formData format
  data.tags = parsedTags;

  // set image path
  if (req.file && req.file.cloudStoragePublicUrl) {
    req.body.imageMainPath = req.file.cloudStoragePublicUrl;
  }

  console.log(req.body);
  const { error } = validatePost(data);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
    // return res.status(400).json({ message: 'Invalid request data' });
  }

  console.log('PASSING VALIDATION');

  const postOld = await Post.findOne({ _id: req.params._id });
  // if such doesnt exists => error

  const postUpdated = postOld.toObject();
  // toObject() method comes from mongoose
  // doc = model.toObject();
  // model = model.constructor;

  postUpdated.title = data.title;
  postUpdated.content = data.content;

  // Start the transaction
  const task = new Fawn.Task(); // eslint-disable-line new-cap

  // IF IMAGEPATH IS CHANGED
  let filename;
  if (req.file) { // if we change the img
    postUpdated.imageMainPath = req.file.cloudStoragePublicUrl;
    filename = postOld.imageMainPath.split('https://storage.googleapis.com/thenewsroom-images-storage-bucket/')[1];
    // image is deleted only if the entire postis updated succesfully (look below after Promise.all(...))
  } else { // if img stays the same
    // no changes required
  }

  // IF CATEGORY CHANGED/UNCHANGED
  let categoryPromise;
  if (postOld.category.name === data.categoryName) {
    postUpdated.category = {
      name: postOld.category.name,
      _id: postOld.category._id,
    };
  } else {
    categoryPromise = Category
      .findOne({ name: data.categoryName })
      .then((category) => {
        // removes post_id from old category
        task.update('categories', {
          _id: postOld.category._id,
        }, { $pull: { posts: postOld._id } });

        // adds post_id to new category
        task.update('categories', {
          _id: category._id,
        }, { $push: { posts: postOld._id } });

        postUpdated.category = { name: category.name, _id: category._id };
      });
  }
  console.log('PASSING CATEGORY');

  // IF SUBCATEGORY CHANGED/UNCHANGED
  let oldSubcategory;
  if (postOld.subcategory.name) {
    oldSubcategory = {
      name: postOld.subcategory.name,
      _id: postOld.subcategory._id,
    };
  }
  const subcategoryPromise = Subcategory
    .findOne({ name: data.subcategoryName || '' })
    .then((newSubcategory) => {
      // 1. if no newSubcategory in postUpdated
      if (!newSubcategory) {
        // 1.1. if no oldSubcategory in postOld exists as well
        // => do nothing

        // 1.2. if oldSubcategory in postOld exists
        if (oldSubcategory) {
          task.update('subcategories', {
            _id: oldSubcategory._id,
          }, { $pull: { posts: postOld._id } });
          task.update('posts', {
            _id: postUpdated._id,
          }, { $unset: { subcategory: '' } });
          postUpdated.subcategory = '';
        }
      } else { // 2. if newSubcategory in postUpdated exists
        // 2.1. no oldSubcategory in postOld exists => must update newSubcategory by adding postOld._id
        if (!oldSubcategory) {
          task.update('subcategories', {
            _id: newSubcategory._id,
          }, { $push: { posts: postUpdated._id } });

          postUpdated.subcategory = {
            name: newSubcategory.name,
            _id: newSubcategory._id,
          };
        } else { // if(oldSubcategory)
          if (oldSubcategory.name === newSubcategory.name) {
            // 2.2. oldSubcategory in postOld exists
            // 2.2.1. oldSubcategory === newSubcategory
            // => do nothing
          } else { // 2.2.2. oldSubcategory !== newSubcategory
            // removes post_id from old subcategory
            task.update('subcategories', {
              _id: oldSubcategory._id,
            }, { $pull: { posts: postOld._id } });

            // adds post_id to new subcategory
            task.update('subcategories', {
              _id: newSubcategory._id,
            }, { $push: { posts: postUpdated._id } });

            postUpdated.subcategory = {
              name: newSubcategory.name,
              _id: newSubcategory._id,
            };
          }
        }
      }
    });
    console.log('PASSING SUBCATEGORY');

  // TAG UPDATE
  if (data.tags.length === 0) {
    return res.status(404).json({ message: 'No tags found' });
  }

  const newtags = new Set(parsedTags);
  const oldTags = new Set(postOld.tags.map((t) => t.name));

  // 1. dIfferent tags in the newTags from oldTags
  const differentTags = [...newtags].filter((item) => {
    return !oldTags.has(item);
  });
  const promisesDifferentTags = [];
  if (differentTags) {
    for (const tagName of differentTags) {
      const differentTagExistsPromise = Tag
        .findOne({ name: tagName })
        .then((differentTagExists) => {
          if (!differentTagExists) {
            const differentTag = new Tag({
              name: tagName,
              posts: [postUpdated._id],
            });
            task.save(differentTag);
            postUpdated.tags.push(differentTag);
          } else {
            task.update('tags', {
              _id: differentTagExists._id,
            }, {
                $push: { posts: postUpdated._id },
              });
            postUpdated.tags.push(differentTagExists);
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
      const tagToRemovePromise = Tag
        .findOne({ name: tagName })
        .then((tagToRemove) => {
          const index = postUpdated.tags.findIndex((tag) => {
            return tag.name === tagName;
          });
          postUpdated.tags.splice(index, 1);
          task.update('tags', {
            _id: tagToRemove._id,
          }, {
              $pull: { posts: postUpdated._id },
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
  console.log('PASSING TAGS');

  return Promise.all(allPromises)
    .then(() => {
      task.update(postOld, postUpdated)
        .options({ viaSave: true });
      return task.run({ useMongoose: true })
        .then((result) => {
          // if image is changed and everything is updated succesfully -> delete old image from cloud
          if (filename) deleteImg(filename);
          res.status(200).json({
            message:
              'Post and (Tag(s)) added successfully. Category, Subcategory and Tags updated succesfully', // eslint-disable-line max-len
            data: result[result.length - 1],
          });
        })
        .catch((err) => {
          throw new Error(err);
        });
    })
    .catch((err) => {
      return res.status(400).json({
        message: 'Invalid request data.' + err,

      });
    });
};


module.exports = {
  updatePost,
};
