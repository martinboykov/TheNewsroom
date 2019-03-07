/* eslint new-cap: ["error", { "capIsNew": false }]*/
const express = require('express');

const router = express.Router();

const categoryController = require('../controllers/category');

router.get('/',
 categoryController.getCategories);

router.get('/:_id/subcategories',
  categoryController.getCategorySubcategories);

router.get('/:name/posts',
  categoryController.getCategoryPosts);

router.get(
  '/:name/posts/totalCount',
  categoryController.getCategoryPostsTotalCount,
);

router.post('/', categoryController.addCategory);

router.put('/:_id', categoryController.renameCategory);

router.delete('/:_id', categoryController.deleteCategory);


module.exports = router;
