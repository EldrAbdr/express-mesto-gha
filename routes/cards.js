const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  cardDeleteConfig,
  cardCreateConfig,
  idCheckConfig,
} = require('../validation/configs');
const {
  getCards,
  deleteCard,
  createCard,
  dislikeCard,
  likeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.delete('/:cardId', celebrate(cardDeleteConfig), deleteCard);

router.post('/', celebrate(cardCreateConfig), createCard);

router.put('/:cardId/likes', celebrate(idCheckConfig), likeCard);

router.delete('/:cardId/likes', celebrate(idCheckConfig), dislikeCard);

module.exports = router;
