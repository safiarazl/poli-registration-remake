const express = require('express');
const router = express.Router();
const poliController = require('../controllers/poli.controller');
const validate = require('../middlewares/validate');
const { createPoliSchema, updatePoliSchema } = require('../validators/poli.validator');
const { verifyToken, requireRole } = require('../middlewares/auth');

router.get('/', verifyToken, poliController.getAll);
router.get('/:id', verifyToken, poliController.getById);

// Only admin can manage poli
router.post('/', verifyToken, requireRole('admin'), validate(createPoliSchema), poliController.create);
router.put('/:id', verifyToken, requireRole('admin'), validate(updatePoliSchema), poliController.update);
router.delete('/:id', verifyToken, requireRole('admin'), poliController.delete);

module.exports = router;
