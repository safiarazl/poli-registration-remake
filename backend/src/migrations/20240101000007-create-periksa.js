'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('periksa', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_daftar_poli: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'daftar_poli',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tgl_periksa: {
        type: Sequelize.DATE,
        allowNull: false
      },
      catatan: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      biaya_periksa: {
        type: Sequelize.INTEGER,
        allowNull: false
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
    await queryInterface.dropTable('periksa');
  }
};
