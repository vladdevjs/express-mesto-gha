const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const authRoutes = require('./routes/auths');
const auth = require('./middlewares/auth');
const handleError = require('./middlewares/handleError');
const documentNotFound = require('./middlewares/documentNotFound');

const { PORT = 3000 } = process.env;

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(extractJWT);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use('/', authRoutes);
app.use(auth);
app.use('/', userRoutes);
app.use('/', cardRoutes);

app.use('*', documentNotFound);

app.use(errors());

app.use(handleError);

app.listen(PORT, () => {
  console.log(`Прослушиваю порт ${PORT}`);
});
