const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { formatUser } = require('../helpers/formatUser');

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
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      return res.send(formatUser(user));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Предоставлены некорректные данные');
      }
      throw err;
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send(formatUser(user));
    })
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
          if (err.name === 'ValidationError') {
            throw new BadRequestError('Предоставлены некорректные данные');
          }
          throw err;
        })
        .catch(next);
    }).catch(next);
};

const login = (req, res, next) => {
  const { email } = req.body;

  return User.findUserByCredentials(email)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-key', {
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
      throw new UnAuthError(`Ошибка авторизации: ${err.message}`);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      return res.send(formatUser(user));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Предоставлены некорректные данные');
      }
      throw err;
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      return res.send(formatUser(user));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Предоставлены некорректные данные');
      }
      throw err;
    })
    .catch(next);
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
