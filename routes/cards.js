const express = require('express');

const router = express.Router();

const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  unLikeCard,
} = require('../controllers/cards');

router.get('/cards', getAllCards);

router.post('/cards/', createCard);

router.delete('/cards/:cardId', deleteCard);

router.put('/cards/:cardId/likes', likeCard);

router.delete('/cards/:cardId/likes', unLikeCard);

module.exports = router;
