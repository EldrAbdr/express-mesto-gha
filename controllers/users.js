const User = require('../models/user');
const {
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
  ERROR_INCORRECT_DATA,
} = require('../errors/errors');

const getUsers = (_req, res) => {
  User.find({}, { name: 1, about: 1, avatar: 1 })
    .then((users) => res.send(users))
    .catch(() => res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка' }));
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
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
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
};

const updateUser = (req, res) => {
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
    },
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
  updateUser,
  updateAvatar,
};
