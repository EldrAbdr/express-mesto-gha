const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  idCheckConfig,
  updateUserConfig,
  linkCheckConfig,
} = require('../validation/configs');
const {
  getUsers,
  getUser,
  updateAvatar,
  updateUser,
  getUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserInfo);

router.get('/:id', celebrate(idCheckConfig), getUser);

router.patch('/me', celebrate(updateUserConfig), updateUser);

router.patch('/me/avatar', celebrate(linkCheckConfig), updateAvatar);

module.exports = router;
