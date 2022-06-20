const router = require('express').Router();
const {
  getUsers,
  getUser,
  createUser,
  login,
  updateAvatar,
  updateUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.post('/signin', login)
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
