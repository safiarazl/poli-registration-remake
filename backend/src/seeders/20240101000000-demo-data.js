'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Create Admin Account
    const adminPassword = await bcrypt.hash('admin123', 10);
    await queryInterface.bulkInsert('akun', [{
      email: 'admin@gmail.com',
      password: adminPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    // 2. Create Polis
    await queryInterface.bulkInsert('poli', [
      { nama_poli: 'Poli Umum', keterangan: 'Dokter Umum', createdAt: new Date(), updatedAt: new Date() },
      { nama_poli: 'Poli Gigi', keterangan: 'Dokter Gigi', createdAt: new Date(), updatedAt: new Date() }
    ], {});

    // 3. Create Obats
    await queryInterface.bulkInsert('obat', [
      { nama_obat: 'Ampicillin', kemasan: 'btl 60 ml', harga: 6000, createdAt: new Date(), updatedAt: new Date() },
      { nama_obat: 'Antasida', kemasan: 'btl', harga: 14000, createdAt: new Date(), updatedAt: new Date() }
    ], {});

    // Fetch the inserted polis
    const polis = await queryInterface.sequelize.query(
      `SELECT id from poli;`
    );
    const poliUmumId = polis[0][0].id;

    // 4. Create Dokter Account
    const dokterPassword = await bcrypt.hash('dokter123', 10);
    await queryInterface.bulkInsert('akun', [{
      email: 'dokter@gmail.com',
      password: dokterPassword,
      role: 'dokter',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    const akunDokter = await queryInterface.sequelize.query(
      `SELECT id from akun where email='dokter@gmail.com';`
    );
    const idAkunDokter = akunDokter[0][0].id;

    await queryInterface.bulkInsert('dokter', [{
      id_akun: idAkunDokter,
      id_poli: poliUmumId,
      nama: 'Dr. Safiar',
      alamat: 'Demak',
      no_hp: '088812345678',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    // 5. Create Pasien Account
    const pasienPassword = await bcrypt.hash('pasien123', 10);
    await queryInterface.bulkInsert('akun', [{
      email: 'pasien@gmail.com',
      password: pasienPassword,
      role: 'pasien',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    const akunPasien = await queryInterface.sequelize.query(
      `SELECT id from akun where email='pasien@gmail.com';`
    );
    const idAkunPasien = akunPasien[0][0].id;

    await queryInterface.bulkInsert('pasien', [{
      id_akun: idAkunPasien,
      nama: 'Hafis',
      alamat: 'Ungaran',
      no_ktp: '33211111111111',
      no_hp: '081234567890',
      no_rm: '202401-1',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('pasien', null, {});
    await queryInterface.bulkDelete('dokter', null, {});
    await queryInterface.bulkDelete('obat', null, {});
    await queryInterface.bulkDelete('poli', null, {});
    await queryInterface.bulkDelete('akun', null, {});
  }
};
