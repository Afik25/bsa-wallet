const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        firstname: DataTypes.STRING,
        lastname: DataTypes.STRING,
        gender: DataTypes.STRING,
        username: DataTypes.STRING, // username is equivalente to User ID
        telephone: DataTypes.STRING,
        mail: DataTypes.STRING,
        birth: DataTypes.STRING,
        birth_location: DataTypes.STRING,
        nationality: DataTypes.STRING,
        sys_role: DataTypes.STRING,
        sys_id: DataTypes.STRING,
        thumbnails: DataTypes.STRING,
        is_completed: DataTypes.BOOLEAN,
        status: DataTypes.INTEGER,
        updated_at: DataTypes.DATE,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: "users",
      }
    );
  }
  
  static associate(models) {
    this.hasMany(models.Inscription, {
      foreignKey: "user_id",
      as: "user_inscription",
      allowNull: false,
    });
    this.hasMany(models.Login, {
      foreignKey: "user_id",
      as: "user_login",
      allowNull: false,
    });
    this.hasMany(models.Configuration, {
      foreignKey: "user_id",
      as: "user_configuration",
      allowNull: false,
    });
  }
}

module.exports = User;
