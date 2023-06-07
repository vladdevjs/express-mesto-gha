const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
});

app.use((req, res, next) => {
  req.user = {
    _id: '647f597098ed11c63b94b43d',
  };

  next();
});

app.use('/', userRoutes);
app.use('/', cardRoutes);

app.listen(PORT, () => {
  console.log(`Прослушиваю порт ${PORT}`);
});
