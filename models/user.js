const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const {
  defaultName,
  defaultAbout,
  defaultAvatar,
} = require('../helpers/defaults');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: defaultName,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: defaultAbout,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: defaultAvatar,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный формат ссылки на аватар',
    },
  },
  email: {
    type: String,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Некорректный формат электронной почты',
    },
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('Неправильные почта или пароль'));
        }

        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
