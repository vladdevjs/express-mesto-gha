const { celebrate, Joi } = require('celebrate');

const validateUserCreate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'any.required': 'Email обязателен для заполнения',
      'string.email': 'Введите корректный адрес электронной почты',
    }),
    password: Joi.string().required().min(8).messages({
      'any.required': 'Пароль обязателен для заполнения',
      'string.min': 'Пароль должен содержать минимум {#limit} символов',
    }),
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'Имя должно содержать минимум {#limit} символов',
      'string.max': 'Имя должно содержать максимум {#limit} символов',
    }),
    about: Joi.string().min(2).max(30).messages({
      'string.min': 'Описание должно содержать минимум {#limit} символов',
      'string.max': 'Описание должно содержать максимум {#limit} символов',
    }),
    avatar: Joi.string().uri({ scheme: ['http', 'https'] }).messages({
      'string.uri': 'Введите корректную ссылку на аватар',
    }),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'any.required': 'Email обязателен для заполнения',
      'string.email': 'Введите корректный адрес электронной почты',
    }),
    password: Joi.string().required().min(8).messages({
      'any.required': 'Пароль обязателен для заполнения',
      'string.min': 'Пароль должен содержать минимум {#limit} символов',
    }),
  }),
});

const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().hex().length(24).messages({
      'string.alphanum': 'Идентификатор пользователя должен содержать только буквы и цифры',
      'string.hex': 'Идентификатор пользователя должен быть в формате шестнадцатеричной строки',
      'string.length': 'Идентификатор пользователя должен содержать {#limit} символов',
    }),
  }),
});

const validateAvatarLink = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().uri({ scheme: ['http', 'https'] }).messages({
      'any.required': 'Ссылка обязательна для заполнения',
      'string.uri': 'Введите корректную ссылку на аватар',
    }),
  }),
});

const validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'Имя должно содержать минимум {#limit} символов',
      'string.max': 'Имя должно содержать максимум {#limit} символов',
    }),
    about: Joi.string().min(2).max(30).messages({
      'string.min': 'Описание должно содержать минимум {#limit} символов',
      'string.max': 'Описание должно содержать максимум {#limit} символов',
    }),
  }),
});

const validateCardData = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'any.required': 'Название обязательно для заполнения',
        'string.min': 'Название должно содержать минимум {#limit} символов',
        'string.max': 'Название должно содержать максимум {#limit} символов',
      }),
    link: Joi.string().required().uri({ scheme: ['http', 'https'] }).messages({
      'any.required': 'Ссылка обязательна для заполнения',
      'string.uri': 'Введите корректную ссылку на изображение',
    }),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().hex().length(24).messages({
      'string.alphanum': 'Идентификатор карточки должен содержать только буквы и цифры',
      'string.hex': 'Идентификатор карточки должен быть в формате шестнадцатеричной строки',
      'string.length': 'Идентификатор карточки должен содержать {#limit} символов',
    }),
  }),
});

module.exports = {
  validateUserCreate,
  validateLogin,
  validateUserId,
  validateAvatarLink,
  validateUserInfo,
  validateCardData,
  validateCardId,
};
