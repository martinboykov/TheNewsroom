/* eslint new-cap: ["error", { "capIsNew": false }]*/
const express = require('express');

const router = express.Router();

const subcategoryController = require('../controllers/subcategory');

router.get('/', subcategoryController.getSubcategories);

router.post('/', subcategoryController.postAddSubcategory);

router.put('/:_id', subcategoryController.putRenameSubcategory);

module.exports = router;
