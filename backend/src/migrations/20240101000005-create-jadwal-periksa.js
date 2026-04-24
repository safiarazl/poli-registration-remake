'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('jadwal_periksa', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_dokter: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'dokter',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      hari: {
        type: Sequelize.ENUM('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'),
        allowNull: false
      },
      jam_mulai: {
        type: Sequelize.TIME,
        allowNull: false
      },
      jam_selesai: {
        type: Sequelize.TIME,
        allowNull: false
      },
      aktif: {
        type: Sequelize.CHAR(1),
        allowNull: false,
        defaultValue: 'N'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('jadwal_periksa');
  }
};
