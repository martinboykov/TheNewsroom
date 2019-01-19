/* eslint new-cap: ["error", { "capIsNew": false }]*/
const express = require('express');

const router = express.Router();

const categoryController = require('../controllers/category');

router.get('/', categoryController.getCategories);

router.post('/', categoryController.addCategory);

router.put('/:_id', categoryController.putRenameCategory);


module.exports = router;
