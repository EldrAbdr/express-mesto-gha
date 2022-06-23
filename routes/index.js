const router = require('express').Router();
const { celebrate } = require('celebrate');
const { signupConfig, signinConfig } = require('../validation/configs');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const cardRouter = require('./cards');
const NotFoundError = require('../errors/notfound-error');

router.post('/signup', celebrate(signupConfig), createUser);
router.post('/signin', celebrate(signinConfig), login);

router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Указан не верный путь'));
});

module.exports = router;
