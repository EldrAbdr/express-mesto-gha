const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors, celebrate, Joi } = require('celebrate');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const { NotFoundError } = require('./errors/errors');
const { signinConfig, signupConfig, linkRegex } = require('./validation/configs');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(bodyParser.json());
app.use(cookieParser());


app.post('/signup', celebrate(signupConfig), createUser);

app.post('/signin', celebrate(signinConfig), login);

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.patch('*', (req, res, next) => {
  next(new NotFoundError('Указан не верный путь'));
});

app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
});

app.listen(PORT);
