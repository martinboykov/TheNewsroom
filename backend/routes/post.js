/* eslint new-cap: ["error", { "capIsNew": false }]*/
const express = require('express');

const router = express.Router();

const postController = require('../controllers/post');

router.get('/', postController.getPosts);

router.post('/', postController.addPost);

router.put('/:_id', postController.updatePost);

module.exports = router;
