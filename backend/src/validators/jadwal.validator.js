const Joi = require('joi');

const createJadwalSchema = Joi.object({
  hari: Joi.string().valid('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu').required(),
  jam_mulai: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/).required().messages({
    'string.pattern.base': 'jam_mulai must be in HH:mm format'
  }),
  jam_selesai: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/).required().messages({
    'string.pattern.base': 'jam_selesai must be in HH:mm format'
  })
});

const updateJadwalSchema = Joi.object({
  hari: Joi.string().valid('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'),
  jam_mulai: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/).messages({
    'string.pattern.base': 'jam_mulai must be in HH:mm format'
  }),
  jam_selesai: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/).messages({
    'string.pattern.base': 'jam_selesai must be in HH:mm format'
  }),
  aktif: Joi.string().valid('Y', 'N')
});

module.exports = {
  createJadwalSchema,
  updateJadwalSchema
};
