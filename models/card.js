const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Не заполнено обязательное поле - \'Название\''],
    minlength: [2, 'Минимальная длина поля \'Название\' - 2 символа'],
    maxlength: [30, 'Максимальная длина поля \'Название\' - 30 символов'],
  },
  link: {
    type: String,
    required: [true, 'Не заполнено обязательное поле - \'Ссылка на картинку\''],
    validate: {
      validator(v) {
        return validator.isUrl(v);
      },
      message: 'Некорректная ссылка',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      default: [],
    },
  ],
  createAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

module.exports = mongoose.model('card', cardSchema);
