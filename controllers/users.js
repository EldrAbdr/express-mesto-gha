const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/notfound-error');
const RequestError = require('../errors/request-error');
const RegistrationError = require('../errors/registration-error');

const getUsers = (_req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send(user);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const
    {
      name,
      about,
      avatar,
      email,
      password,
    } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new RegistrationError(
          'Пользователь с такими данными уже существует',
        );
      }
      bcrypt.hash(password, 10).then((hash) => {
        User.create(
          {
            name,
            about,
            avatar,
            email,
            password: hash,
          },
        )
          .then((newUser) => {
            res.send({
              _id: newUser.id,
              email: newUser.email,
              name: newUser.name,
              about: newUser.about,
              avatar: newUser.avatar,
            });
          })
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new RequestError('Некорректные данные при создании карточки'));
            } else {
              next(err);
            }
          });
      });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-secret', {
        expiresIn: '1w',
      });
      res.cookie('jwt', token, { httpOnly: true }).send(user);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          next(new RequestError(err.message));
          break;
        case 'CastError':
          next(new RequestError('Не корректный id пользователя'));
          break;
        default:
          next(err);
          break;
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
    },
  )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          next(new RequestError(err.message));
          break;
        case 'CastError':
          next(new RequestError('Не корректный id пользователя'));
          break;
        default:
          next(err);
          break;
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  login,
  updateUser,
  updateAvatar,
  getUserInfo,
};
