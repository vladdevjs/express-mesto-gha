const Card = require('../models/card');

const { formatCard } = require('../helpers/card');

const { notFound, badRequest, defaultError } = require('../helpers/errors');

const getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards.map(formatCard));
    })
    .catch(() => {
      res.status(defaultError).send({ message: 'Произошла ошибка' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.send(formatCard(card));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Предоставлены некорректные данные' });
        return;
      }
      res.status(defaultError).send({ message: 'Произошла ошибка' });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(notFound)
          .send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return res.send(formatCard(card));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequest).send({ message: 'Предоставлены некорректные данные.' });
        return;
      }
      res.status(defaultError).send({ message: 'Произошла ошибка' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(notFound)
          .send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return res.send(formatCard(card));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequest).send({ message: 'Предоставлены некорректные данные.' });
        return;
      }
      res.status(defaultError).send({ message: 'Произошла ошибка' });
    });
};

const unLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(notFound)
          .send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return res.send(formatCard(card));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequest).send({ message: 'Предоставлены некорректные данные.' });
        return;
      }
      res.status(defaultError).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  unLikeCard,
};
