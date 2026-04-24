const Joi = require('joi');

const createPasienSchema = Joi.object({
  nama: Joi.string().required(),
  alamat: Joi.string().required(),
  no_ktp: Joi.string().pattern(/^[0-9]+$/).required().messages({
    'string.pattern.base': 'no_ktp must contain only numbers'
  }),
  no_hp: Joi.string().pattern(/^[0-9]+$/).required().messages({
    'string.pattern.base': 'no_hp must contain only numbers'
  }),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const updatePasienSchema = Joi.object({
  nama: Joi.string(),
  alamat: Joi.string(),
  no_ktp: Joi.string().pattern(/^[0-9]+$/).messages({
    'string.pattern.base': 'no_ktp must contain only numbers'
  }),
  no_hp: Joi.string().pattern(/^[0-9]+$/).messages({
    'string.pattern.base': 'no_hp must contain only numbers'
  })
});

module.exports = {
  createPasienSchema,
  updatePasienSchema
};
