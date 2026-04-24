const Joi = require('joi');

const createPeriksaSchema = Joi.object({
  id_daftar_poli: Joi.number().integer().required(),
  tgl_periksa: Joi.date().iso().required(),
  catatan: Joi.string().required(),
  obat_ids: Joi.array().items(Joi.number().integer()).min(1).required()
});

const updatePeriksaSchema = Joi.object({
  tgl_periksa: Joi.date().iso(),
  catatan: Joi.string(),
  obat_ids: Joi.array().items(Joi.number().integer()).min(1)
});

module.exports = {
  createPeriksaSchema,
  updatePeriksaSchema
};
