const express = require('express');

const router = express.Router();

const { validateUserCreate, validateLogin } = require('../helpers/validations');

const { createUser, login } = require('../controllers/users');

router.post('/signup', validateUserCreate, createUser);

router.post('/signin/', validateLogin, login);

module.exports = router;
