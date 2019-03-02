const getPost = require('./getPost');
const addPost = require('./addPost');
const updateEntirePost = require('./updateEntirePost');
const updatPartialPost = require('./updatPartialPost');
const deletePost = require('./deletePost');
module.exports = {
  ...getPost,
  ...addPost,
  ...updateEntirePost,
  ...updatPartialPost,
  ...deletePost,
};
