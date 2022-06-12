const User = require("../models/user");

const ERROR_INCORRECT_DATA = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_DEFAULT = 500;

const getUsers = (_req, res) => {
  User.find({}, { name: 1, about: 1, avatar: 1 })
    .then((users) => res.send(users))
    .catch((err) =>
      res.status(ERROR_DEFAULT).send({ message: "Произошла ошибка" })
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
        .send({ message: "Запрашиваемый пользователь не найден" });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(ERROR_INCORRECT_DATA)
          .send({ message: "Переданы некорректные данные" });
      } else {
        res.status(ERROR_DEFAULT).send({ message: "Произошла ошибка" });
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
      if (err.name === "ValidationError") {
        res
          .status(ERROR_INCORRECT_DATA)
          .send({ message: "Переданы некорректные данные" });
      } else {
        res.status(ERROR_DEFAULT).send({ message: "Произошла ошибка" });
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
      if (err.name === "ValidationError") {
        res
          .status(ERROR_INCORRECT_DATA)
          .send({ message: "Переданы некорректные данные" });
      } else {
        res.status(ERROR_DEFAULT).send({ message: "Произошла ошибка" });
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
      if (err.name === "ValidationError") {
        res
          .status(ERROR_INCORRECT_DATA)
          .send({ message: "Переданы некорректные данные" });
      } else {
        res.status(ERROR_DEFAULT).send({ message: "Произошла ошибка" });
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  ERROR_INCORRECT_DATA,
  ERROR_DEFAULT,
  ERROR_NOT_FOUND,
};
