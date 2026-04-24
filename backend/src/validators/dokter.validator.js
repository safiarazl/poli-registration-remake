const Joi = require('joi');

const createDokterSchema = Joi.object({
  nama: Joi.string().required(),
  alamat: Joi.string().required(),
  no_hp: Joi.string().pattern(/^[0-9]+$/).required().messages({
    'string.pattern.base': 'no_hp must contain only numbers'
  }),
  id_poli: Joi.number().integer().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const updateDokterSchema = Joi.object({
  nama: Joi.string(),
  alamat: Joi.string(),
  no_hp: Joi.string().pattern(/^[0-9]+$/).messages({
    'string.pattern.base': 'no_hp must contain only numbers'
  }),
  id_poli: Joi.number().integer()
});

module.exports = {
  createDokterSchema,
  updateDokterSchema
};
