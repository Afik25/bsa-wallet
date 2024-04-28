const { Model, DataTypes } = require("sequelize");

class Configuration extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: DataTypes.INTEGER,
        notify_on_update: DataTypes.BOOLEAN,
        send_weekly_digest: DataTypes.BOOLEAN,
        tags: DataTypes.STRING,
        theme: DataTypes.STRING,
        language: DataTypes.STRING,
        two_step_verification: DataTypes.BOOLEAN,
        updated_at: DataTypes.DATE,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: "configurations",
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "configuration",
      allowNull: false,
    });
  }
}

module.exports = Configuration;
