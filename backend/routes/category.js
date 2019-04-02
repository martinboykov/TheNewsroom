/* eslint new-cap: ["error", { "capIsNew": false }]*/
const express = require('express');

const router = express.Router();

const categoryController = require('../controllers/category');

const auth = require('../middleware/auth');

router.get('/',
 categoryController.getCategories);

router.get('/full',
 categoryController.getCategoriesFull);

 router.get('/:name',
 categoryController.getCategory);

router.get('/:name/posts',
  categoryController.getCategoryPosts);

router.get('/:name/posts/partial',
  categoryController.getCategoryPostsPartial);

router.get(
  '/:name/posts/totalCount',
  categoryController.getCategoryPostsTotalCount,
);

router.post('/',
auth,
categoryController.addCategory);

router.put('/:_id',
auth,
categoryController.updateCategory);

router.delete('/:_id',
auth,
categoryController.deleteCategory);


module.exports = router;
