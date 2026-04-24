const express = require('express');
const router = express.Router();
const periksaController = require('../controllers/periksa.controller');
const validate = require('../middlewares/validate');
const { createPeriksaSchema, updatePeriksaSchema } = require('../validators/periksa.validator');
const { verifyToken, requireRole } = require('../middlewares/auth');

router.get('/me', verifyToken, requireRole('pasien'), periksaController.getMyPeriksa);
router.get('/', verifyToken, requireRole('admin', 'dokter'), periksaController.getAll);
router.post('/', verifyToken, requireRole('dokter'), validate(createPeriksaSchema), periksaController.create);
router.put('/:id', verifyToken, requireRole('dokter'), validate(updatePeriksaSchema), periksaController.update);

module.exports = router;
