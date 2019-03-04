/* eslint new-cap: ["error", { "capIsNew": false }]*/
const express = require('express');

const router = express.Router();

const subcategoryController = require('../controllers/subcategory');

router.get(
  '/',
  subcategoryController.getSubcategories);

router.get(
  '/posts/:name',
  subcategoryController.getSubcategoryPosts);

router.get(
  '/posts/:name/totalCount',
  subcategoryController.getSubcategoryPostsTotalCount,
);

router.post(
  '/',
  subcategoryController.addSubcategory);

router.put(
  '/:_id',
  subcategoryController.renameSubcategory);

router.delete(
  '/:_id',
  subcategoryController.deleteSubcategory);

module.exports = router;
