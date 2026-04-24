const express = require('express');
const router = express.Router();
const jadwalController = require('../controllers/jadwal.controller');
const validate = require('../middlewares/validate');
const { createJadwalSchema, updateJadwalSchema } = require('../validators/jadwal.validator');
const { verifyToken, requireRole } = require('../middlewares/auth');

// Anyone authenticated can view jadwals
router.get('/', verifyToken, jadwalController.getAll);
router.get('/:id', verifyToken, jadwalController.getById);
router.get('/dokter/:dokterId', verifyToken, jadwalController.getByDokter);

// Only Dokter can manage their own jadwal
router.post('/', verifyToken, requireRole('dokter'), validate(createJadwalSchema), jadwalController.create);
router.put('/:id', verifyToken, requireRole('dokter'), validate(updateJadwalSchema), jadwalController.update);
router.delete('/:id', verifyToken, requireRole('dokter'), jadwalController.delete);

module.exports = router;
