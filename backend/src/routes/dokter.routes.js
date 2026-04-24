const express = require('express');
const router = express.Router();
const dokterController = require('../controllers/dokter.controller');
const validate = require('../middlewares/validate');
const { createDokterSchema, updateDokterSchema } = require('../validators/dokter.validator');
const { verifyToken, requireRole } = require('../middlewares/auth');

// Available to Admin and Pasien (to select doctor)
router.get('/', verifyToken, dokterController.getAll);
router.get('/:id', verifyToken, dokterController.getById);

// Only admin can manage dokter
router.post('/', verifyToken, requireRole('admin'), validate(createDokterSchema), dokterController.create);
router.put('/:id', verifyToken, requireRole('admin'), validate(updateDokterSchema), dokterController.update);
router.delete('/:id', verifyToken, requireRole('admin'), dokterController.delete);

module.exports = router;
