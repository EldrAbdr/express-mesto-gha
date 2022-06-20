const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
  ERROR_INCORRECT_DATA,
} = require('../errors/errors');

const getUsers = (_req, res) => {
  User.find({}, { name: 1, about: 1, avatar: 1 })
    .then((users) => res.send(users))
    .catch(() =>
      res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка' })
    );
};

const getUser = (req, res) => {
  User.findById(req.params.id, { name: 1, about: 1, avatar: 1 })
    .then((user) => {
      if (user) {
        res.send(user);
        return;
      }
      res
        .status(ERROR_NOT_FOUND)
        .send({ message: 'Запрашиваемый пользователь не найден' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(ERROR_INCORRECT_DATA)
          .send({ message: 'Переданы некорректные данные' });
      } else {
        res
          .status(ERROR_DEFAULT)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const createUser = (req, res) => {
  //проверка на сущесив юзера
  const { name, about, avatar, email, password } = req.body;
  console.log(name, about, avatar, email, password);
  User.findOne({ email: email })
    .then((user) => {
      console.log(user);
      if (user) {
        return res.status(404).send({ message: 'Пользователь уже существует' });
      }
      bcrypt.hash(password, 10).then((hash) => {
        User.create({ name, about, avatar, email, password: hash })
          .then((user) => {
            res.send({
              name: user.name,
              about: user.about,
              avatar: user.avatar,
              _id: user._id,
              email: user.email,
              password: user.password,
            });
          })
          .catch((err) => {
            if (err.name === 'ValidationError') {
              res.status(ERROR_INCORRECT_DATA).send({ message: err.message });
            } else {
              res
                .status(ERROR_DEFAULT)
                .send({ message: 'На сервере произошла ошибка' });
            }
          });
      });
    })
    .catch((err) => {
      //????????????????????????????
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      console.log(user);
      const token = jwt.sign({ _id: user._id }, 'super-secret', {
        expiresIn: '1w',
      });
      res.cookie('jwt', token, {httpOnly: true}).end();
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      if (user) {
        res.send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user._id,
        });
        return;
      }
      res
        .status(ERROR_NOT_FOUND)
        .send({ message: 'Запрашиваемый пользователь не найден' });
    })
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          res.status(ERROR_INCORRECT_DATA).send({ message: err.message });
          break;
        case 'CastError':
          res
            .status(ERROR_INCORRECT_DATA)
            .send({ message: 'Не корректный id пользователя' });
          break;
        default:
          res
            .status(ERROR_DEFAULT)
            .send({ message: 'На сервере произошла ошибка' });
          break;
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
    }
  )
    .then((user) => {
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          res.status(ERROR_INCORRECT_DATA).send({ message: err.message });
          break;
        case 'CastError':
          res
            .status(ERROR_INCORRECT_DATA)
            .send({ message: 'Не корректный id пользователя' });
          break;
        default:
          res
            .status(ERROR_DEFAULT)
            .send({ message: 'На сервере произошла ошибка' });
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
};
