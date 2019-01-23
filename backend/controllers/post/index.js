const getPost = require('./getPost');
const addPost = require('./addPost');
const updatePost = require('./updatePost');
const deletePost = require('./deletePost');
module.exports = {
  ...getPost,
  ...addPost,
  ...updatePost,
  ...deletePost,
};
