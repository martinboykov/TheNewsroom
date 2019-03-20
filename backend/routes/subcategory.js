/* eslint new-cap: ["error", { "capIsNew": false }]*/
const express = require('express');

const router = express.Router();

const subcategoryController = require('../controllers/subcategory');

router.get(
  '/',
  subcategoryController.getSubcategories);

router.get(
  '/:name',
  subcategoryController.getSubcategory);

router.get(
  '/:name/postIds',
  subcategoryController.getSubcategoryPostIds);

router.get(
  '/:name/posts',
  subcategoryController.getSubcategoryPosts);

router.get(
  '/:name/posts/totalCount',
  subcategoryController.getSubcategoryPostsTotalCount,
);

router.post(
  '/',
  subcategoryController.addSubcategory);

router.put(
  '/:_id',
  subcategoryController.updateSubcategory);

router.delete(
  '/:_id',
  subcategoryController.deleteSubcategory);

module.exports = router;
