const { Model, DataTypes } = require("sequelize");

class Room extends Model {
  static init(sequelize) {
    super.init(
      {
        token: DataTypes.STRING,
        status: DataTypes.BOOLEAN,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: "rooms",
      }
    );
  }

  static associate(models) {
    this.hasMany(models.Login, {
      foreignKey: "room_id",
      as: "room_login",
      allowNull: false,
    });
  }
}

module.exports = Room;
