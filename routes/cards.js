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

router.delete('/:id', celebrate(idCheckConfig), deleteCard);

router.post('/', celebrate(cardCreateConfig), createCard);

router.put('/:id/likes', celebrate(idCheckConfig), likeCard);

router.delete('/:id/likes', celebrate(idCheckConfig), dislikeCard);

module.exports = router;
