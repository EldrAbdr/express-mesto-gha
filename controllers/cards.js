const Cards = require('../models/card');
const {
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
  ERROR_INCORRECT_DATA,
} = require('../errors/errors');

const getCards = (req, res) => {
  Cards.find({}, {
    name: 1, about: 1, link: 1, owner: 1, likes: 1,
  })
    .then((cards) => res.send(cards))
    .catch(() => res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Cards.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send({
        name: card.name,
        about: card.about,
        link: card.link,
        owner: card.owner,
        likes: card.likes,
        _id: card._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_INCORRECT_DATA)
          .send({ message: err.message });
      } else {
        res
          .status(ERROR_DEFAULT)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const deleteCard = (req, res) => {
  Cards.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (card) {
        res.send(card).message('Карточка удалена');
        return;
      }
      res
        .status(ERROR_NOT_FOUND)
        .send({ message: 'Запрашиваемая карточка не найдена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(ERROR_INCORRECT_DATA)
          .send({ message: 'Не корректный id карточки' });
      } else {
        res
          .status(ERROR_DEFAULT)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const likeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({
          name: card.name,
          about: card.about,
          link: card.link,
          owner: card.owner,
          likes: card.likes,
          _id: card._id,
        });
        return;
      }
      res
        .status(ERROR_NOT_FOUND)
        .send({ message: 'Запрашиваемая карточка не найдена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(ERROR_INCORRECT_DATA)
          .send({ message: 'Не корректный id карточки' });
      } else {
        res
          .status(ERROR_DEFAULT)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const dislikeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({
          name: card.name,
          about: card.about,
          link: card.link,
          owner: card.owner,
          likes: card.likes,
          _id: card._id,
        });
        return;
      }
      res
        .status(ERROR_NOT_FOUND)
        .send({ message: 'Запрашиваемая карточка не найдена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(ERROR_INCORRECT_DATA)
          .send({ message: 'Не корректный id карточки' });
      } else {
        res
          .status(ERROR_DEFAULT)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
