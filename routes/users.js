const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUser,
  updateAvatar,
  updateUser,
  getUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserInfo);

router.get('/:id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24),
  })
}), getUser);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUser
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().pattern(
        new RegExp(
          '^((http|https):\\/\\/)?(www\\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\\-]*\\.?)*\\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\\/([\\w#!:.?+=&%@!\\-\\/])*)?'
        )
      ),
    }),
  }),
  updateAvatar
);

module.exports = router;
