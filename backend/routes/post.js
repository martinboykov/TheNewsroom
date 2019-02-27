/* eslint new-cap: ["error", { "capIsNew": false }]*/
const express = require('express');

const router = express.Router();

const postController = require('../controllers/post');

const { redisMiddleware } = require('../middleware/redis');


router.get('/', redisMiddleware, postController.getPosts);

router.get('/totalCount', redisMiddleware, postController.getTotalCount);

router.get('/post/:_id', redisMiddleware, postController.getPost);

router.post('/', postController.addPost);

router.put('/post/:_id', postController.updatePost);

router.delete('/post/:_id', postController.deletePost);

module.exports = router;
