const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [2, 'Минимальная длина поля \'Пароль\' - 2 символа'],
  },
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля \'Имя\' - 2 символа'],
    maxlength: [30, 'Максимальная длина поля \'Имя\' - 30 символов'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длина поля \'Профессия\' - 2 символа'],
    maxlength: [30, 'Максимальная длина поля \'Профессия\' - 30 символов'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
});

userSchema.statics.findUserByCredentials = function(email, password) {
  return this.findOne({email})
    .then(user => {
      if(!user) {
        return Promise.reject((new Error('Неправильные почта или пароль')));
      }
      console.log('bcrypt')
      return bcrypt.compare(password, user.password)
        .then(matched => {
          if(!matched) {
            return Promise.reject((new Error('Неправильные почта или пароль')));
          }
          console.log(user)
          return user;
        })
    })
};

module.exports = mongoose.model('user', userSchema);
