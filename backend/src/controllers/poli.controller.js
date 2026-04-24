const { Poli } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const polis = await Poli.findAll();
    res.json(polis);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const poli = await Poli.findByPk(req.params.id);
    if (!poli) return res.status(404).json({ message: 'Poli not found' });
    res.json(poli);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const poli = await Poli.create(req.body);
    res.status(201).json(poli);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const poli = await Poli.findByPk(req.params.id);
    if (!poli) return res.status(404).json({ message: 'Poli not found' });
    
    await poli.update(req.body);
    res.json(poli);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const poli = await Poli.findByPk(req.params.id);
    if (!poli) return res.status(404).json({ message: 'Poli not found' });
    
    await poli.destroy();
    res.json({ message: 'Poli deleted successfully' });
  } catch (error) {
    next(error);
  }
};
