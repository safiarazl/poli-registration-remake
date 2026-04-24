module.exports = (sequelize, DataTypes) => {
  const Poli = sequelize.define('Poli', {
    nama_poli: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'poli',
    timestamps: true
  });

  Poli.associate = function(models) {
    Poli.hasMany(models.Dokter, { foreignKey: 'id_poli', as: 'dokters' });
  };

  return Poli;
};
