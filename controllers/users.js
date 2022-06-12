const User = require("../models/user");

const getUsers = (_req, res) => {
  User.find({}, { name: 1, about: 1, avatar: 1 })
    .then((users) => res.send(users))
    .catch((_) => res.status(404).send({ message: "Произошла ошибка" }));
};

const getUser = (req, res) => {
  User.findById(req.params.id, { name: 1, about: 1, avatar: 1 })
    .then((user) => {
      res.send(user);
    })
    .catch((_) => res.status(404).send({ message: "Пользователь не найден" }));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id
      });
    })
    .catch((_) => res.status(404).send({ message: "Произошла ошибка" }));
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
    }
  )
    .then((user) => {
        res.send({
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            _id: user._id
        });
    })
    .catch((_) => res.status(404).send({ message: "Произошла ошибка" }));
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
            _id: user._id
        });
    })
    .catch((_) => res.status(404).send({ message: "Произошла ошибка" }));
};

module.exports = { getUsers, getUser, createUser, updateUser, updateAvatar };
