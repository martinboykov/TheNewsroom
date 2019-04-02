/* eslint new-cap: ["error", { "capIsNew": false }]*/
const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');

const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');

router.get(
  '/',
  auth,
  authAdmin,
  userController.getUsersByType
);

router.get(
  '/:_id',
  auth,
  authAdmin,
  userController.getUserById
);

router.put(
  '/:_id',
  auth,
  authAdmin,
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
