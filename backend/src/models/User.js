const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'dokter', 'pasien'),
      allowNull: false
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'akun', // Keep mapping to original schema table name if wanted, but using 'users' might be better for conventions.
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  });

  User.prototype.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  User.associate = function(models) {
    User.hasOne(models.Dokter, { foreignKey: 'id_akun', as: 'dokter' });
    User.hasOne(models.Pasien, { foreignKey: 'id_akun', as: 'pasien' });
  };

  return User;
};
