const { Model, DataTypes } = require("sequelize");

class Login extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: DataTypes.INTEGER,
        dates: DataTypes.DATE,
        location: DataTypes.STRING,
        latitude: DataTypes.STRING,
        longitude: DataTypes.STRING,
        device: DataTypes.STRING,
        ip_address: DataTypes.STRING,
        operating_system: DataTypes.STRING,
        navigator: DataTypes.STRING,
        refresh_token: DataTypes.TEXT,
        connection_status: DataTypes.INTEGER,
        updated_at: DataTypes.DATE,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: "logins",
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user_login",
      allowNull: false,
    });
  }
}

module.exports = Login;
