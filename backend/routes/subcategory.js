/* eslint new-cap: ["error", { "capIsNew": false }]*/
const express = require('express');

const router = express.Router();

const subcategoryController = require('../controllers/subcategory');

router.get('/', subcategoryController.getSubcategories);

router.post('/', subcategoryController.addSubcategory);

router.put('/:_id', subcategoryController.renameSubcategory);

module.exports = router;
