const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const extractJWT = require('./middlewares/extractJWT');
const handleError = require('./middlewares/handleError');
const documentNotFound = require('./middlewares/documentNotFound');
const { validateUserCreate, validateLogin } = require('./helpers/validations');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(extractJWT);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.post('/signin', validateLogin, login);
app.post('/signup', validateUserCreate, createUser);

app.use(auth);

app.use('/', userRoutes);
app.use('/', cardRoutes);

app.use('*', documentNotFound);

app.use(errors());

app.use(handleError);

app.listen(PORT, () => {
  console.log(`Прослушиваю порт ${PORT}`);
});
