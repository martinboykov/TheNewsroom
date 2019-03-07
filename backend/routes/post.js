/* eslint new-cap: ["error", { "capIsNew": false }]*/
const express = require('express');

const router = express.Router();

const postController = require('../controllers/post');

router.get('/',
  postController.getPosts);

router.get('/totalCount',
  postController.getPostsTotalCount);

router.get('/latest',
  postController.getLatestPosts);

router.get('/popular',
  postController.getPopularPosts);

router.get('/commented',
  postController.getComentedPosts);

router.get('/:_id/details',
  postController.getPost);

router.get('/:_id/comments',
  postController.getPostComments);

router.get('/:_id/related/',
  postController.getRelatedPosts);

router.post('/', postController.addPost);

router.put('/:_id/comments/', postController.addComment);

router.put('/:_id', postController.updatePost);

router.put('/:_id/popularity', postController.popularityIncrease);

router.delete('/:_id', postController.deletePost);

module.exports = router;
