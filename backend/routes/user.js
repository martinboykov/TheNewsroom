/* eslint new-cap: ["error", { "capIsNew": false }]*/
const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');

router.get(
  '/:_id',
  userController.getUserById
);
router.get(
  '/search/:searchQuery',
  userController.getSearchedUser
);
router.get(
  '/readers',
  userController.getUsersReaders
);

router.get(
  '/writers',
  userController.getUsersWriters
);

router.get(
  '/admins',
  userController.getUsersAdmins
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
