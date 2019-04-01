/* eslint new-cap: ["error", { "capIsNew": false }]*/
const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');

router.get(
  '/',
  userController.getUsersByType
);

router.get(
  '/:_id',
  userController.getUserById
);

router.put(
  '/:_id',
  userController.updateUserRole
);

router.post(
  '/signup',
  userController.signup
);

router.post(
  '/login',
  userController.login,
);

module.exports = router;
