const { Model, DataTypes } = require("sequelize");

class Inscription extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: DataTypes.INTEGER,
        dates: DataTypes.DATE,
        code: DataTypes.STRING,
        location: DataTypes.STRING, // get the name of city. ex: madrid
        latitude: DataTypes.STRING,
        longitude: DataTypes.STRING,
        device: DataTypes.STRING,
        ip_address: DataTypes.STRING,
        operating_system: DataTypes.STRING,
        navigator: DataTypes.STRING,
        updated_at: DataTypes.DATE,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: "inscriptions",
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user_inscription",
      allowNull: false,
    });
  }
}

module.exports = Inscription;
