const { JadwalPeriksa, Dokter, Poli } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const jadwals = await JadwalPeriksa.findAll({
      include: [{
        model: Dokter,
        as: 'dokter',
        include: [{ model: Poli, as: 'poli' }]
      }]
    });
    res.json(jadwals);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const jadwal = await JadwalPeriksa.findByPk(req.params.id, {
      include: [{
        model: Dokter,
        as: 'dokter',
        include: [{ model: Poli, as: 'poli' }]
      }]
    });
    if (!jadwal) return res.status(404).json({ message: 'Jadwal not found' });
    res.json(jadwal);
  } catch (error) {
    next(error);
  }
};

exports.getByDokter = async (req, res, next) => {
  try {
    const jadwals = await JadwalPeriksa.findAll({
      where: { id_dokter: req.params.dokterId },
      include: [{
        model: Dokter,
        as: 'dokter',
        include: [{ model: Poli, as: 'poli' }]
      }]
    });
    res.json(jadwals);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const dokter = await Dokter.findOne({ where: { id_akun: req.user.id } });
    if (!dokter) return res.status(403).json({ message: 'Only dokter can create jadwal' });

    // Business rule: A doctor cannot have overlapping schedules or multiple schedules on the same day if not required,
    // but the original app allowed multiple if time differs. Let's just create.
    const jadwal = await JadwalPeriksa.create({
      id_dokter: dokter.id,
      hari: req.body.hari,
      jam_mulai: req.body.jam_mulai,
      jam_selesai: req.body.jam_selesai,
      aktif: 'N' // Default to not active. Doctor must activate it manually.
    });

    res.status(201).json(jadwal);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const dokter = await Dokter.findOne({ where: { id_akun: req.user.id } });
    if (!dokter) return res.status(403).json({ message: 'Forbidden' });

    const jadwal = await JadwalPeriksa.findByPk(req.params.id);
    if (!jadwal) return res.status(404).json({ message: 'Jadwal not found' });
    
    if (jadwal.id_dokter !== dokter.id) {
      return res.status(403).json({ message: 'You can only update your own jadwal' });
    }
    
    // Business rule: Only one active schedule per doctor
    if (req.body.aktif === 'Y') {
      await JadwalPeriksa.update({ aktif: 'N' }, { where: { id_dokter: dokter.id } });
    }

    await jadwal.update(req.body);
    res.json(jadwal);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const dokter = await Dokter.findOne({ where: { id_akun: req.user.id } });
    if (!dokter) return res.status(403).json({ message: 'Forbidden' });

    const jadwal = await JadwalPeriksa.findByPk(req.params.id);
    if (!jadwal) return res.status(404).json({ message: 'Jadwal not found' });
    
    if (jadwal.id_dokter !== dokter.id) {
      return res.status(403).json({ message: 'You can only delete your own jadwal' });
    }
    
    await jadwal.destroy();
    res.json({ message: 'Jadwal deleted successfully' });
  } catch (error) {
    next(error);
  }
};
