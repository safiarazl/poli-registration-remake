module.exports = (sequelize, DataTypes) => {
  const DaftarPoli = sequelize.define('DaftarPoli', {
    id_pasien: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_jadwal: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    keluhan: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    no_antrian: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'menunggu' // menunggu, diperiksa, selesai
    }
  }, {
    tableName: 'daftar_poli',
    timestamps: true
  });

  DaftarPoli.associate = function(models) {
    DaftarPoli.belongsTo(models.Pasien, { foreignKey: 'id_pasien', as: 'pasien' });
    DaftarPoli.belongsTo(models.JadwalPeriksa, { foreignKey: 'id_jadwal', as: 'jadwal' });
    DaftarPoli.hasOne(models.Periksa, { foreignKey: 'id_daftar_poli', as: 'periksa' });
  };

  return DaftarPoli;
};
