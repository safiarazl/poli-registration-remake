module.exports = (sequelize, DataTypes) => {
  const Pasien = sequelize.define('Pasien', {
    id_akun: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false
    },
    alamat: {
      type: DataTypes.STRING,
      allowNull: false
    },
    no_ktp: {
      type: DataTypes.STRING,
      allowNull: false
    },
    no_hp: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    no_rm: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'pasien',
    timestamps: true
  });

  Pasien.associate = function(models) {
    Pasien.belongsTo(models.User, { foreignKey: 'id_akun', as: 'akun' });
    Pasien.hasMany(models.DaftarPoli, { foreignKey: 'id_pasien', as: 'daftar_polis' });
  };

  return Pasien;
};
