const { ValidationError, CastError } = require('mongoose').Error;

const Card = require('../models/card');

const { formatCard } = require('../helpers/formatCard');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

const getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards.map(formatCard));
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.send(formatCard(card));
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(new NotFoundError('Запрашиваемая карточка не найдена'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нет прав на удаление карточки');
      }
      return Card.findByIdAndRemove(cardId);
    })
    .then((deletedCard) => res.send(formatCard(deletedCard)))
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Предоставлены некорректные данные'));
      } else {
        next(err);
      }
    });
};

const updateCardLikes = (req, res, next, action) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    action,
    { new: true },
  )
    .orFail(new NotFoundError('Запрашиваемая карточка не найдена'))
    .then((card) => res.send(formatCard(card)))
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Предоставлены некорректные данные'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  const action = { $addToSet: { likes: req.user._id } };
  updateCardLikes(req, res, next, action);
};

const unLikeCard = (req, res, next) => {
  const action = { $pull: { likes: req.user._id } };
  updateCardLikes(req, res, next, action);
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  unLikeCard,
};
