module.exports = (sequelize, DataTypes) => {
  const DetailPeriksa = sequelize.define('DetailPeriksa', {
    id_periksa: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_obat: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'detail_periksa',
    timestamps: true
  });

  DetailPeriksa.associate = function(models) {
    DetailPeriksa.belongsTo(models.Periksa, { foreignKey: 'id_periksa', as: 'periksa' });
    DetailPeriksa.belongsTo(models.Obat, { foreignKey: 'id_obat', as: 'obat' });
  };

  return DetailPeriksa;
};
