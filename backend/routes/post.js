/* eslint new-cap: ["error", { "capIsNew": false }]*/
const express = require('express');

const router = express.Router();

const postController = require('../controllers/post');

const images = require('../middleware/image');

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

router.post('/',
  images.multer.single('image'),
  images.sendUploadToGCS,
  postController.addPost);

router.put('/:_id', postController.updatePost);

router.put('/:_id/popularity', postController.popularityIncrease);

router.put('/:_id/comments/', postController.addComment);

router.delete('/:_id', postController.deletePost);

module.exports = router;
