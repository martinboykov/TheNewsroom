/* eslint new-cap: ["error", { "capIsNew": false }]*/
const express = require('express');

const router = express.Router();

const postController = require('../controllers/post');

router.get('/', postController.getPosts);

router.get('/totalCount', postController.getTotalCount);

router.get('/post/:_id', postController.getPost);

router.post('/', postController.addPost);

router.put('/post/:_id', postController.updatePost);

router.delete('/post/:_id', postController.deletePost);

module.exports = router;
