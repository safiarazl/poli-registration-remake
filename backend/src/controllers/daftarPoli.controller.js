const { DaftarPoli, Pasien, JadwalPeriksa, Dokter, Poli } = require('../models');
const { Op } = require('sequelize');

exports.getAll = async (req, res, next) => {
  try {
    const filter = {};
    // If user is a doctor, only show registrations for their schedule
    if (req.user.role === 'dokter') {
      const dokter = await Dokter.findOne({ where: { id_akun: req.user.id } });
      if (!dokter) return res.status(403).json({ message: 'Forbidden' });
      
      const jadwals = await JadwalPeriksa.findAll({ where: { id_dokter: dokter.id } });
      const jadwalIds = jadwals.map(j => j.id);
      
      filter.id_jadwal = { [Op.in]: jadwalIds };
    }

    const daftarPolis = await DaftarPoli.findAll({
      where: filter,
      include: [
        { model: Pasien, as: 'pasien' },
        { 
          model: JadwalPeriksa, 
          as: 'jadwal',
          include: [{
            model: Dokter,
            as: 'dokter',
            include: [{ model: Poli, as: 'poli' }]
          }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(daftarPolis);
  } catch (error) {
    next(error);
  }
};

exports.getMyDaftar = async (req, res, next) => {
  try {
    const pasien = await Pasien.findOne({ where: { id_akun: req.user.id } });
    if (!pasien) return res.status(403).json({ message: 'Forbidden' });

    const daftarPolis = await DaftarPoli.findAll({
      where: { id_pasien: pasien.id },
      include: [
        { 
          model: JadwalPeriksa, 
          as: 'jadwal',
          include: [{
            model: Dokter,
            as: 'dokter',
            include: [{ model: Poli, as: 'poli' }]
          }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(daftarPolis);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const pasien = await Pasien.findOne({ where: { id_akun: req.user.id } });
    if (!pasien) return res.status(403).json({ message: 'Only pasien can register to poli' });

    const { id_jadwal, keluhan } = req.body;

    const jadwal = await JadwalPeriksa.findByPk(id_jadwal);
    if (!jadwal) return res.status(404).json({ message: 'Jadwal not found' });
    if (jadwal.aktif === 'N') return res.status(400).json({ message: 'Jadwal is not active' });

    // Generate Queue Number
    const count = await DaftarPoli.count({ where: { id_jadwal } });
    const no_antrian = count + 1;

    const daftarPoli = await DaftarPoli.create({
      id_pasien: pasien.id,
      id_jadwal,
      keluhan,
      no_antrian,
      status: 'menunggu'
    });

    res.status(201).json(daftarPoli);
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const daftarPoli = await DaftarPoli.findByPk(req.params.id);
    if (!daftarPoli) return res.status(404).json({ message: 'Daftar Poli not found' });
    
    // Only the assigned doctor (or admin) can update status
    if (req.user.role === 'dokter') {
      const dokter = await Dokter.findOne({ where: { id_akun: req.user.id } });
      const jadwal = await JadwalPeriksa.findByPk(daftarPoli.id_jadwal);
      if (!dokter || !jadwal || jadwal.id_dokter !== dokter.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }
    }

    await daftarPoli.update({ status: req.body.status });
    res.json(daftarPoli);
  } catch (error) {
    next(error);
  }
};
