module.exports = (sequelize, DataTypes) => {
  const Periksa = sequelize.define('Periksa', {
    id_daftar_poli: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tgl_periksa: {
      type: DataTypes.DATE,
      allowNull: false
    },
    catatan: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    biaya_periksa: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'periksa',
    timestamps: true
  });

  Periksa.associate = function(models) {
    Periksa.belongsTo(models.DaftarPoli, { foreignKey: 'id_daftar_poli', as: 'daftar_poli' });
    Periksa.hasMany(models.DetailPeriksa, { foreignKey: 'id_periksa', as: 'detail_periksas' });
  };

  return Periksa;
};
