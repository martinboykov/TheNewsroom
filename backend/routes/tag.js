/* eslint new-cap: ["error", { "capIsNew": false }]*/
const express = require('express');

const router = express.Router();

const tagController = require('../controllers/tag');

router.get(
  '/',
  tagController.getTags
);

router.get(
  '/:name/posts',
  tagController.getTagPosts
);

router.get(
  '/:name/posts/totalCount',
  tagController.getTagPostsTotalCount,
);

module.exports = router;
