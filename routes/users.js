const express = require('express');

const router = express.Router();

const { validateUserId, validateAvatarLink, validateUserInfo } = require('../helpers/validations');

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/me', getUserInfo);

router.get('/users/:userId', validateUserId, getUserById);

router.patch('/users/me', validateUserInfo, updateUser);

router.patch('/users/me/avatar', validateAvatarLink, updateAvatar);

module.exports = router;
