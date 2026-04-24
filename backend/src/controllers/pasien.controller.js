const { Pasien, User } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const pasiens = await Pasien.findAll({
      include: [{ model: User, as: 'akun', attributes: ['email'] }]
    });
    res.json(pasiens);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    // If patient is logged in, they can only see their own profile
    if (req.user.role === 'pasien') {
      const pasien = await Pasien.findOne({ where: { id_akun: req.user.id } });
      if (pasien && pasien.id !== parseInt(req.params.id)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
    }

    const pasien = await Pasien.findByPk(req.params.id, {
      include: [{ model: User, as: 'akun', attributes: ['email'] }]
    });
    if (!pasien) return res.status(404).json({ message: 'Pasien not found' });
    res.json(pasien);
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const pasien = await Pasien.findOne({ 
      where: { id_akun: req.user.id },
      include: [{ model: User, as: 'akun', attributes: ['email'] }]
    });
    if (!pasien) return res.status(404).json({ message: 'Pasien profile not found' });
    res.json(pasien);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { email, password, nama, alamat, no_ktp, no_hp } = req.body;
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const existingKtp = await Pasien.findOne({ where: { no_ktp } });
    if (existingKtp) {
      return res.status(400).json({ message: 'KTP already registered' });
    }

    // Generate no_rm (Format: YYYYMM-ID)
    const yearMonth = new Date().toISOString().slice(0, 7).replace('-', '');
    const count = await Pasien.count();
    const no_rm = `${yearMonth}-${count + 1}`;

    const user = await User.create({ email, password, role: 'pasien' });

    const pasien = await Pasien.create({
      id_akun: user.id,
      nama,
      alamat,
      no_ktp,
      no_hp,
      no_rm
    });

    res.status(201).json(pasien);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    // If patient is logged in, they can only update their own profile
    if (req.user.role === 'pasien') {
      const myProfile = await Pasien.findOne({ where: { id_akun: req.user.id } });
      if (myProfile && myProfile.id !== parseInt(req.params.id)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
    }

    const pasien = await Pasien.findByPk(req.params.id);
    if (!pasien) return res.status(404).json({ message: 'Pasien not found' });
    
    await pasien.update(req.body);
    res.json(pasien);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const pasien = await Pasien.findByPk(req.params.id);
    if (!pasien) return res.status(404).json({ message: 'Pasien not found' });
    
    const userId = pasien.id_akun;
    await pasien.destroy();
    
    await User.destroy({ where: { id: userId } });
    
    res.json({ message: 'Pasien deleted successfully' });
  } catch (error) {
    next(error);
  }
};
