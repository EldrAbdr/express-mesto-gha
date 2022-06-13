const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '62a4a7abed2ecdb07f2ba20b',
  };
  next();
});
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.patch('*', (_req, res) => {
  res.status(404).send({ message: 'Указан не верный путь' });
});

app.listen(PORT);
