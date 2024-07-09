const { Model, DataTypes } = require("sequelize");

class Login extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: DataTypes.INTEGER,
        room_id: DataTypes.INTEGER,
        dates: DataTypes.DATE,
        from: DataTypes.STRING, // mobile or web
        code: DataTypes.STRING,
        location: DataTypes.STRING,
        latitude: DataTypes.STRING,
        longitude: DataTypes.STRING,
        device: DataTypes.STRING,
        ip_address: DataTypes.STRING,
        operating_system: DataTypes.STRING,
        navigator: DataTypes.STRING,
        refresh_token: DataTypes.TEXT,
        confirm_status: DataTypes.BOOLEAN,
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
    this.belongsTo(models.Room, {
      foreignKey: "room_id",
      as: "login_room",
      allowNull: false,
    });
  }
}

module.exports = Login;
