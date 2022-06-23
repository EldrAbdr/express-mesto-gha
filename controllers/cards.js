const Cards = require('../models/card');
const NotFoundError = require('../errors/notfound-error');
const RequestError = require('../errors/request-error');
const IllegalAccess = require('../errors/illegal-access-error');

const getCards = (req, res, next) => {
  Cards.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Cards.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError(err.message));
      } else {
        next(err);
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
      return Cards.findByIdAndDelete(req.params.id)
        .then(() => {
          res.send(card);
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Не корректный id карточки'));
      } else {
        next(err);
      }
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
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Не корректный id карточки'));
      } else {
        next(err);
      }
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
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Не корректный id карточки'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
