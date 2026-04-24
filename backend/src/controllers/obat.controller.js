const { Obat } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const obats = await Obat.findAll();
    res.json(obats);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const obat = await Obat.findByPk(req.params.id);
    if (!obat) return res.status(404).json({ message: 'Obat not found' });
    res.json(obat);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const obat = await Obat.create(req.body);
    res.status(201).json(obat);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const obat = await Obat.findByPk(req.params.id);
    if (!obat) return res.status(404).json({ message: 'Obat not found' });
    
    await obat.update(req.body);
    res.json(obat);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const obat = await Obat.findByPk(req.params.id);
    if (!obat) return res.status(404).json({ message: 'Obat not found' });
    
    await obat.destroy();
    res.json({ message: 'Obat deleted successfully' });
  } catch (error) {
    next(error);
  }
};
