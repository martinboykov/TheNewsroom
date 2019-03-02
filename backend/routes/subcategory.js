/* eslint new-cap: ["error", { "capIsNew": false }]*/
const express = require('express');

const router = express.Router();

const subcategoryController = require('../controllers/subcategory');

const { redisMiddleware } = require('../middleware/redis');

router.get('/', redisMiddleware, subcategoryController.getSubcategories);

router.get(
  '/posts/:name',
  redisMiddleware,
  subcategoryController.getSubcategoryPosts);

router.get(
  '/posts/:name/totalCount',
  // redisMiddleware,
  subcategoryController.getSubcategoryPostsTotalCount,
);

router.post('/', subcategoryController.addSubcategory);

router.put('/:_id', subcategoryController.renameSubcategory);

router.delete('/:_id', subcategoryController.deleteSubcategory);

module.exports = router;
