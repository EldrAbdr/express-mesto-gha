const Cards = require('../models/card');
const {
  NotFoundError,
  RequestError,
  IllegalAccess,
} = require('../errors/errors');

const getCards = (req, res, next) => {
  Cards.find({}, {
    name: 1, about: 1, link: 1, owner: 1, likes: 1,
  })
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
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
        next(new RequestError(err.message));
      }
    });
};

const deleteCard = (req, res, next) => {
  Cards.findById(req.params.id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }
      if (!(card.owner.toString() === req.user._id)) {
        throw new IllegalAccess('Удалить карточку может только создатель');
      }
      Cards.findByIdAndDelete(req.params.id)
        .then(() => {
          res.send(card);
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Не корректный id карточки'));
      }
      next(err);
    });
};

const likeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }
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
      if (err.name === 'CastError') {
        next(new RequestError('Не корректный id карточки'));
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }
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
      if (err.name === 'CastError') {
        next(new RequestError('Не корректный id карточки'));
      }
      next(err);
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
