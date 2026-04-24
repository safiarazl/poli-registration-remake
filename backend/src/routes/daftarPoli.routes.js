const express = require('express');
const router = express.Router();
const daftarPoliController = require('../controllers/daftarPoli.controller');
const validate = require('../middlewares/validate');
const { createDaftarPoliSchema, updateStatusSchema } = require('../validators/daftarPoli.validator');
const { verifyToken, requireRole } = require('../middlewares/auth');

// Pasien can get their own registrations
router.get('/me', verifyToken, requireRole('pasien'), daftarPoliController.getMyDaftar);

// Admin and Dokter can get all (filtered by doctor in controller)
router.get('/', verifyToken, requireRole('admin', 'dokter'), daftarPoliController.getAll);

// Pasien creates registration
router.post('/', verifyToken, requireRole('pasien'), validate(createDaftarPoliSchema), daftarPoliController.create);

// Dokter updates status (menunggu -> diperiksa -> selesai)
router.patch('/:id/status', verifyToken, requireRole('dokter', 'admin'), validate(updateStatusSchema), daftarPoliController.updateStatus);

module.exports = router;
