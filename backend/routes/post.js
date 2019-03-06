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

router.get('/post/details/:_id',
  postController.getPost);
router.get('/post/comments/:_id',
  postController.getPostComments);

router.get('/post/related/:_id',
  postController.getRelatedPosts);

router.post('/', postController.addPost);

router.put('/post/comments/:_id', postController.addComment);

router.put('/post/:_id', postController.updatePost);


router.delete('/post/:_id', postController.deletePost);

module.exports = router;
