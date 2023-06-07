const User = require('../models/user');

const { formatUser } = require('../helpers/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users.map(formatUser));
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.send(formatUser(user));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Предоставлены некорректные данные.' });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send(formatUser(user));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Предоставлены некорректные данные' });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.send(formatUser(user));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Предоставлены некорректные данные.' });
        return;
      }
      res.status(500).send({ message: "Произошла ошибка" });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.send(formatUser(user));
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
