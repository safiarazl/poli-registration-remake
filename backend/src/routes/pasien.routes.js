const express = require('express');
const router = express.Router();
const pasienController = require('../controllers/pasien.controller');
const validate = require('../middlewares/validate');
const { createPasienSchema, updatePasienSchema } = require('../validators/pasien.validator');
const { verifyToken, requireRole } = require('../middlewares/auth');

// Pasien can get their own profile
router.get('/me', verifyToken, requireRole('pasien'), pasienController.getMe);

// Admin can get all
router.get('/', verifyToken, requireRole('admin'), pasienController.getAll);

// Admin or the Pasien themselves can get by ID
router.get('/:id', verifyToken, requireRole('admin', 'pasien'), pasienController.getById);

// Anyone can register as Pasien (we expose this in Auth but Admin can also create Pasien)
router.post('/', validate(createPasienSchema), pasienController.create);

// Admin or the Pasien themselves can update
router.put('/:id', verifyToken, requireRole('admin', 'pasien'), validate(updatePasienSchema), pasienController.update);

// Only admin can delete
router.delete('/:id', verifyToken, requireRole('admin'), pasienController.delete);

module.exports = router;
