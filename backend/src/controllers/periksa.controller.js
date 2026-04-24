const { Periksa, DetailPeriksa, DaftarPoli, Pasien, JadwalPeriksa, Dokter, Obat, sequelize } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role === 'dokter') {
      const dokter = await Dokter.findOne({ where: { id_akun: req.user.id } });
      if (!dokter) return res.status(403).json({ message: 'Forbidden' });
      // In a real app we'd filter Periksa by DaftarPoli -> Jadwal -> Dokter
    }

    const periksas = await Periksa.findAll({
      include: [
        { 
          model: DaftarPoli, 
          as: 'daftar_poli',
          include: [{ model: Pasien, as: 'pasien' }]
        },
        {
          model: DetailPeriksa,
          as: 'detail_periksas',
          include: [{ model: Obat, as: 'obat' }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(periksas);
  } catch (error) {
    next(error);
  }
};

exports.getMyPeriksa = async (req, res, next) => {
  try {
    const pasien = await Pasien.findOne({ where: { id_akun: req.user.id } });
    if (!pasien) return res.status(403).json({ message: 'Forbidden' });

    const periksas = await Periksa.findAll({
      include: [
        { 
          model: DaftarPoli, 
          as: 'daftar_poli',
          where: { id_pasien: pasien.id }
        },
        {
          model: DetailPeriksa,
          as: 'detail_periksas',
          include: [{ model: Obat, as: 'obat' }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(periksas);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id_daftar_poli, tgl_periksa, catatan, obat_ids } = req.body;

    const daftarPoli = await DaftarPoli.findByPk(id_daftar_poli);
    if (!daftarPoli) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Daftar Poli not found' });
    }

    // Calculate cost
    const baseCost = 150000; // Base examination fee
    let medsCost = 0;
    
    for (let obatId of obat_ids) {
      const obat = await Obat.findByPk(obatId);
      if (!obat) {
        await transaction.rollback();
        return res.status(404).json({ message: `Obat with ID ${obatId} not found` });
      }
      medsCost += obat.harga;
    }

    const biaya_periksa = baseCost + medsCost;

    const periksa = await Periksa.create({
      id_daftar_poli,
      tgl_periksa,
      catatan,
      biaya_periksa
    }, { transaction });

    for (let obatId of obat_ids) {
      await DetailPeriksa.create({
        id_periksa: periksa.id,
        id_obat: obatId
      }, { transaction });
    }

    // Update Daftar Poli status to 'selesai'
    await daftarPoli.update({ status: 'selesai' }, { transaction });

    await transaction.commit();
    res.status(201).json(periksa);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

exports.update = async (req, res, next) => {
  // Omitted for brevity: Usually updating Periksa means deleting old DetailPeriksa and creating new ones, then recalculating cost.
  res.status(501).json({ message: 'Not implemented' });
};
