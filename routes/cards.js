const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  deleteCard,
  createCard,
  dislikeCard,
  likeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().length(24),
    }),
  }),
  deleteCard,
);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().pattern(
        new RegExp(
          '^((http|https):\\/\\/)?(www\\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\\-]*\\.?)*\\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\\/([\\w#!:.?+=&%@!\\-\\/])*)?',
        ),
      ),
    }),
  }),
  createCard,
);

router.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().length(24),
    }),
  }),
  likeCard
);

router.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().length(24),
    }),
  }),
  dislikeCard
);

module.exports = router;
