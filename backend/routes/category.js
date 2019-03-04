/* eslint new-cap: ["error", { "capIsNew": false }]*/
const express = require('express');

const router = express.Router();

const categoryController = require('../controllers/category');

router.get('/',
 categoryController.getCategories);

router.get('/subcategories/:_id',
  categoryController.getCategorySubcategories);

router.get('/posts/:name',
  categoryController.getCategoryPosts);

router.get(
  '/posts/:name/totalCount',
  categoryController.getCategoryPostsTotalCount,
);

router.post('/', categoryController.addCategory);

router.put('/:_id', categoryController.renameCategory);

router.delete('/:_id', categoryController.deleteCategory);


module.exports = router;
