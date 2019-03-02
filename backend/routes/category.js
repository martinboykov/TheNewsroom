/* eslint new-cap: ["error", { "capIsNew": false }]*/
const express = require('express');

const router = express.Router();

const categoryController = require('../controllers/category');

const { redisMiddleware } = require('../middleware/redis');

router.get('/', redisMiddleware, categoryController.getCategories);

router.get('/subcategories/:_id',
  redisMiddleware,
  categoryController.getCategorySubcategories);

router.get('/posts/:name',
  // redisMiddleware,
  categoryController.getCategoryPosts);

router.get(
  '/posts/:name/totalCount',
  // redisMiddleware,
  categoryController.getCategoryPostsTotalCount,
);

router.post('/', categoryController.addCategory);

router.put('/:_id', categoryController.renameCategory);

router.delete('/:_id', categoryController.deleteCategory);


module.exports = router;
