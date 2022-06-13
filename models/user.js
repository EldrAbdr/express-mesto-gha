const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Не заполнено обязательное поле - \'Имя\''],
    minlength: [2, 'Минимальная длина поля \'Имя\' - 2 символа'],
    maxlength: [30, 'Максимальная длина поля \'Имя\' - 30 символов'],
  },
  about: {
    type: String,
    required: [true, 'Не заполнено обязательное поле - \'Профессия\''],
    minlength: [2, 'Минимальная длина поля \'Профессия\' - 2 символа'],
    maxlength: [30, 'Максимальная длина поля \'Профессия\' - 30 символов'],
  },
  avatar: {
    type: String,
    required: [true, 'Не заполнено обязательное поле - \'Ссылка на аватар\''],
  },
});

module.exports = mongoose.model('user', userSchema);
