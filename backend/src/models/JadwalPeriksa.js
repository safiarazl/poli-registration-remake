module.exports = (sequelize, DataTypes) => {
  const JadwalPeriksa = sequelize.define('JadwalPeriksa', {
    id_dokter: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    hari: {
      type: DataTypes.ENUM('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'),
      allowNull: false
    },
    jam_mulai: {
      type: DataTypes.TIME,
      allowNull: false
    },
    jam_selesai: {
      type: DataTypes.TIME,
      allowNull: false
    },
    aktif: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: 'N'
    }
  }, {
    tableName: 'jadwal_periksa',
    timestamps: true
  });

  JadwalPeriksa.associate = function(models) {
    JadwalPeriksa.belongsTo(models.Dokter, { foreignKey: 'id_dokter', as: 'dokter' });
    JadwalPeriksa.hasMany(models.DaftarPoli, { foreignKey: 'id_jadwal', as: 'daftar_polis' });
  };

  return JadwalPeriksa;
};
