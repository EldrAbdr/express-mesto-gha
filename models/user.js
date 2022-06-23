const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AuthorizationError = require('../errors/authorization-error');
const { linkRegex } = require('../validation/configs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Поле "email" должно быть заполнено'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Поле "password" должно быть заполнено'],
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
      function(v) {
        return linkRegex.test(v);
      },
      message: 'Некорректная ссылка',
    },
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password, next) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthorizationError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new AuthorizationError('Неправильные почта или пароль');
        }
        return user;
      });
    })
    .catch(next);
};

module.exports = mongoose.model('user', userSchema);
