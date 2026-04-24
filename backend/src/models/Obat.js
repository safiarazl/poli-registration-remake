module.exports = (sequelize, DataTypes) => {
  const Obat = sequelize.define('Obat', {
    nama_obat: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    kemasan: {
      type: DataTypes.STRING(35),
      allowNull: false
    },
    harga: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'obat',
    timestamps: true
  });

  Obat.associate = function(models) {
    Obat.hasMany(models.DetailPeriksa, { foreignKey: 'id_obat', as: 'detail_periksas' });
  };

  return Obat;
};
