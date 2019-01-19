/* eslint new-cap: ["error", { "capIsNew": false }]*/
const express = require('express');

const router = express.Router();

const subcategoryController = require('../controllers/subcategory');

router.get('/', subcategoryController.getSubcategories);

router.post('/', subcategoryController.addSubcategory);

module.exports = router;
