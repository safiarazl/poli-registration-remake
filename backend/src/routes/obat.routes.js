const express = require('express');
const router = express.Router();
const obatController = require('../controllers/obat.controller');
const validate = require('../middlewares/validate');
const { createObatSchema, updateObatSchema } = require('../validators/obat.validator');
const { verifyToken, requireRole } = require('../middlewares/auth');

// Available to all authenticated users
router.get('/', verifyToken, obatController.getAll);
router.get('/:id', verifyToken, obatController.getById);

// Only admin can manage obat
router.post('/', verifyToken, requireRole('admin'), validate(createObatSchema), obatController.create);
router.put('/:id', verifyToken, requireRole('admin'), validate(updateObatSchema), obatController.update);
router.delete('/:id', verifyToken, requireRole('admin'), obatController.delete);

module.exports = router;
