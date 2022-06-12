const Cards = require("../models/card");

const getCards = (req, res) => {
  Cards.find({}, {name: 1, about: 1, link: 1, owner: 1, likes: 1})
    .then((cards) => res.send(cards))
    .catch((_) => res.status(404).send({ message: "Произошла ошибка" }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Cards.create({ name, link, owner: req.user._id })
    .then(card => {
      res.send({
        name: card.name,
        about: card.about,
        link: card.link,
        owner: card.owner,
        likes: card.likes,
        _id: card._id
      })
    })
    .catch((_) => res.status(400).send({ message: "Произошла ошибка" }));
};

const deleteCard = (req, res) => {
  Cards.findByIdAndDelete(req.params.cardId)
    .then((card) => res.send(card).message("Пост удален"))
    .catch((_) => res.status(400).send({ message: "Произошла ошибка" }));
};

const likeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id }},
    { new: true }
  )
      .then(card => {
        res.send({
          name: card.name,
          about: card.about,
          link: card.link,
          owner: card.owner,
          likes: card.likes,
          _id: card._id
        })
      })
      .catch((_) => res.status(400).send({ message: "Произошла ошибка" }))
};

const dislikeCard = (req, res) => {
  Cards.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
  )
      .then(card => {
        res.send({
          name: card.name,
          about: card.about,
          link: card.link,
          owner: card.owner,
          likes: card.likes,
          _id: card._id
        })
      })
      .catch((_) => res.status(400).send({ message: "Произошла ошибка" }));
};

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };
