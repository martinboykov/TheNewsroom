/* eslint new-cap: ["error", { "capIsNew": false }]*/
const express = require('express');

const router = express.Router();

const tagController = require('../controllers/tag');

router.get('/', tagController.getTags);

router.get('/:_id', tagController.getTagPosts);

module.exports = router;
