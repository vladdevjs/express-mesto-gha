const express = require('express');

const router = express.Router();

const { validateCardData, validateCardId } = require('../helpers/validations');

const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  unLikeCard,
} = require('../controllers/cards');

router.get('/cards', getAllCards);

router.post('/cards/', validateCardData, createCard);

router.delete('/cards/:cardId', validateCardId, deleteCard);

router.put('/cards/:cardId/likes', validateCardId, likeCard);

router.delete('/cards/:cardId/likes', validateCardId, unLikeCard);

module.exports = router;
