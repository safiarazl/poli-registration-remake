const Joi = require('joi');

const createPoliSchema = Joi.object({
  nama_poli: Joi.string().max(25).required(),
  keterangan: Joi.string().required()
});

const updatePoliSchema = Joi.object({
  nama_poli: Joi.string().max(25),
  keterangan: Joi.string()
});

module.exports = {
  createPoliSchema,
  updatePoliSchema
};
