/* eslint new-cap: ["error", { "capIsNew": false }]*/
const express = require('express');

const router = express.Router();

const subcategoryController = require('../controllers/subcategory');

const auth = require('../middleware/auth');

router.get(
  '/',
  subcategoryController.getSubcategories);

router.get(
  '/:name',
  subcategoryController.getSubcategory);

router.get(
  '/:name/posts/partial',
  subcategoryController.getSubcategoryPostsPartial);

router.get(
  '/:name/posts',
  subcategoryController.getSubcategoryPosts);

router.get(
  '/:name/posts/totalCount',
  subcategoryController.getSubcategoryPostsTotalCount,
);

router.post(
  '/',
  auth,
  subcategoryController.addSubcategory);

router.put(
  '/:_id',
  auth,
  subcategoryController.updateSubcategory);

router.delete(
  '/:_id',
  auth,
  subcategoryController.deleteSubcategory);

module.exports = router;
