const Joi = require('joi');

const createObatSchema = Joi.object({
  nama_obat: Joi.string().max(50).required(),
  kemasan: Joi.string().max(35).required(),
  harga: Joi.number().integer().min(0).required()
});

const updateObatSchema = Joi.object({
  nama_obat: Joi.string().max(50),
  kemasan: Joi.string().max(35),
  harga: Joi.number().integer().min(0)
});

module.exports = {
  createObatSchema,
  updateObatSchema
};
