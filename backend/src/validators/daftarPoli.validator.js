const Joi = require('joi');

const createDaftarPoliSchema = Joi.object({
  id_jadwal: Joi.number().integer().required(),
  keluhan: Joi.string().min(5).required()
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('menunggu', 'diperiksa', 'selesai').required()
});

module.exports = {
  createDaftarPoliSchema,
  updateStatusSchema
};
