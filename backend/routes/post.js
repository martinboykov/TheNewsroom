/* eslint new-cap: ["error", { "capIsNew": false }]*/
const express = require('express');

const router = express.Router();

const postController = require('../controllers/post');

const { redisMiddleware } = require('../middleware/redis');


router.get('/', redisMiddleware, postController.getPosts);

router.get('/totalCount',
  redisMiddleware,
  postController.getTotalCount);

router.get('/latest',
  // redisMiddleware,
  postController.getLatestPosts);

router.get('/popular',
  // redisMiddleware,
  postController.getPopularPosts);

router.get('/commented',
  // redisMiddleware,
  postController.getComentedPosts);

router.get('/post/details/:_id',
  // redisMiddleware,
  postController.getPost);

router.get('/post/related/:_id',
  // redisMiddleware,
  postController.getRelatedPosts);

router.post('/', postController.addPost);

router.put('/post/addComment/:_id', postController.addComment);

router.put('/post/:_id', postController.updatePost);


router.delete('/post/:_id', postController.deletePost);

module.exports = router;
