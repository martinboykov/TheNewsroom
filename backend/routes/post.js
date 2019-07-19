/* eslint new-cap: ["error", { "capIsNew": false }]*/
const express = require('express');

const router = express.Router();

const postController = require('../controllers/post');

const images = require('../middleware/image');

const auth = require('../middleware/auth');

const authEditPost = require('../middleware/authEditPost');
const authAdmin = require('../middleware/authAdmin');
const authWriter = require('../middleware/authWriter');
const authReader = require('../middleware/authReader');

router.get('/',
  postController.getPosts);

router.get('/totalCount', postController.getPostsTotalCount);

router.get('/search/:searchQuery',
  postController.getSearchedPosts);

router.get('/search/:searchQuery/totalCount',
  postController.getSearchedPostsTotalCount);

router.get('/latest', postController.getLatestPosts);

router.get('/popular', postController.getPopularPosts);

router.get('/commented', postController.getComentedPosts);

router.get('/:_id/details', postController.getPost);

router.get('/:_id/comments', postController.getPostComments);

router.get('/:_id/related/', postController.getRelatedPosts);

router.get(
  '/slack',
  postController.getSlackWebHook
);

router.post('/',
  auth,
  authWriter,
  images.multer.single('imageMainPath'),
  images.sendUploadToGCS,
  postController.addPost);

router.put('/:_id',
  auth,
  authWriter,
  authEditPost,
  images.multer.single('imageMainPath'),
  images.sendUploadToGCS,
  postController.updatePost);

router.put('/:_id/popularity',
  postController.popularityIncrease);

router.put('/:_id/comments/',
  auth,
  authReader,
  postController.addComment);

router.delete('/:_id',
  auth,
  authWriter,
  authEditPost,
  postController.deletePost);

module.exports = router;
