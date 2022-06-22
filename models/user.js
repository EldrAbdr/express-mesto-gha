const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { RequestError } = require('../errors/errors');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: [2, "Минимальная длина поля 'Имя' - 2 символа"],
    maxlength: [30, "Максимальная длина поля 'Имя' - 30 символов"],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, "Минимальная длина поля 'Профессия' - 2 символа"],
    maxlength: [30, "Максимальная длина поля 'Профессия' - 30 символов"],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: function (v) {
        const regex = /^((http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/;
        return regex.test(v);
      },
      message: (props) => `${props.value} некорректная ссылка`,
    },
  },
});

userSchema.statics.findUserByCredentials = function (email, password, next) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        throw new RequestError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new RequestError('Неправильные почта или пароль');
        }
        return user;
      });
    })
    .catch(next);
};

module.exports = mongoose.model('user', userSchema);
