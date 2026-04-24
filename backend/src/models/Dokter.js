module.exports = (sequelize, DataTypes) => {
  const Dokter = sequelize.define('Dokter', {
    id_akun: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    id_poli: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false
    },
    alamat: {
      type: DataTypes.STRING,
      allowNull: false
    },
    no_hp: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    tableName: 'dokter',
    timestamps: true
  });

  Dokter.associate = function(models) {
    Dokter.belongsTo(models.User, { foreignKey: 'id_akun', as: 'akun' });
    Dokter.belongsTo(models.Poli, { foreignKey: 'id_poli', as: 'poli' });
    Dokter.hasMany(models.JadwalPeriksa, { foreignKey: 'id_dokter', as: 'jadwals' });
  };

  return Dokter;
};
