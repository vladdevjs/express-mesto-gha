const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ValidationError, CastError } = require('mongoose').Error;
const User = require('../models/user');
const { formatUser } = require('../helpers/formatUser');
const { secretKey } = require('../config');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const UnAuthError = require('../errors/unauth-err');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users.map(formatUser));
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(new NotFoundError('Запрашиваемый пользователь не найден'))
    .then((user) => res.send(formatUser(user)))
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Предоставлены некорректные данные'));
      } else {
        next(err);
      }
    });
};

const getUserInfo = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .orFail(new NotFoundError('Запрашиваемый пользователь не найден'))
    .then((user) => res.send(formatUser(user)))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        throw new ConflictError(
          'Пользователь с таким email уже зарегистрирован',
        );
      }

      bcrypt
        .hash(password, 10)
        .then((hash) => User.create({
          name,
          about,
          avatar,
          email,
          password: hash,
        }))
        .then((user) => {
          res.send(formatUser(user));
        })
        .catch((err) => {
          if (err instanceof ValidationError) {
            next(new BadRequestError('Предоставлены некорректные данные'));
          } else {
            next(err);
          }
        });
    }).catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, secretKey, {
        expiresIn: '7d',
      });
      res
        .cookie('jwt', token, {
          httpOnly: true,
          maxAge: 3600000 * 24 * 7,
        })
        .send({ message: 'Авторизация прошла успешно' });
    })
    .catch((err) => {
      next(new UnAuthError(`Ошибка авторизации: ${err.message}`));
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('Запрашиваемый пользователь не найден'))
    .then((user) => res.send(formatUser(user)))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError('Предоставлены некорректные данные'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('Запрашиваемый пользователь не найден'))
    .then((user) => res.send(formatUser(user)))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError('Предоставлены некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  login,
  updateUser,
  updateAvatar,
  getUserInfo,
};
