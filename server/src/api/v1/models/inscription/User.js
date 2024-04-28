const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        firstname: DataTypes.STRING,
        lastname: DataTypes.STRING,
        gender: DataTypes.STRING,
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
        hooks: {
          beforeCreate: (user) => {
            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(user.password, salt);
          },
          beforeUpdate: (user) => {
            if (user.password) {
              const salt = bcrypt.genSaltSync();
              user.password = bcrypt.hashSync(user.password, salt);
            }
          },
        },
      }
    );
  }
  static associate(models) {
    this.hasMany(models.Inscription, {
      foreignKey: "user_id",
      as: "user_inscription",
      allowNull: false,
    });
    this.hasMany(models.Subscription, {
      foreignKey: "user_id",
      as: "user_subscription",
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
