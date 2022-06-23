const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const routes = require('./routes/index');
const errorsHandler = require('./middlewares/errors-handler');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());

app.use(routes);

app.use(errors());
app.use(errorsHandler);

app.listen(PORT);
