/* eslint new-cap: ["error", { "capIsNew": false }]*/
const express = require('express');

const router = express.Router();

const categoryController = require('../controllers/category');

router.get('/',
 categoryController.getCategories);

router.get('/full',
 categoryController.getCategoriesFull);

 router.get('/:name',
 categoryController.getCategory);

router.get('/:name/posts',
  categoryController.getCategoryPosts);

router.get(
  '/:name/posts/totalCount',
  categoryController.getCategoryPostsTotalCount,
);

router.post('/', categoryController.addCategory);

router.put('/:_id', categoryController.updateCategory);

router.delete('/:_id', categoryController.deleteCategory);


module.exports = router;
