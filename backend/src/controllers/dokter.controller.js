const { Dokter, User, Poli } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const dokters = await Dokter.findAll({
      include: [
        { model: Poli, as: 'poli' },
        { model: User, as: 'akun', attributes: ['email'] }
      ]
    });
    res.json(dokters);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const dokter = await Dokter.findByPk(req.params.id, {
      include: [
        { model: Poli, as: 'poli' },
        { model: User, as: 'akun', attributes: ['email'] }
      ]
    });
    if (!dokter) return res.status(404).json({ message: 'Dokter not found' });
    res.json(dokter);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { email, password, nama, alamat, no_hp, id_poli } = req.body;
    
    // Check if email exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Create user first
    const user = await User.create({ email, password, role: 'dokter' });

    // Then create dokter profile
    const dokter = await Dokter.create({
      id_akun: user.id,
      id_poli,
      nama,
      alamat,
      no_hp
    });

    res.status(201).json(dokter);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const dokter = await Dokter.findByPk(req.params.id);
    if (!dokter) return res.status(404).json({ message: 'Dokter not found' });
    
    await dokter.update(req.body);
    res.json(dokter);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const dokter = await Dokter.findByPk(req.params.id);
    if (!dokter) return res.status(404).json({ message: 'Dokter not found' });
    
    const userId = dokter.id_akun;
    await dokter.destroy();
    
    // Delete associated user
    await User.destroy({ where: { id: userId } });
    
    res.json({ message: 'Dokter deleted successfully' });
  } catch (error) {
    next(error);
  }
};
