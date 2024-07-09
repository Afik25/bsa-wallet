const { Model, DataTypes } = require("sequelize");

class Operation extends Model {
  static init(sequelize) {
    super.init(
      {
        emeter_account_id: DataTypes.INTEGER,
        receiver_account_id: DataTypes.INTEGER,
        type: DataTypes.STRING, // send, receive, withdraw, deposit
        key: DataTypes.STRING, // operation reference code
        amount: DataTypes.STRING,
        currency: DataTypes.STRING,
        status: DataTypes.STRING,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: "operations",
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Account, {
      foreignKey: "emeter_account_id",
      as: "operation_emeter_account",
      allowNull: false,
    });
    this.belongsTo(models.Account, {
      foreignKey: "receiver_account_id",
      as: "operation_receiver_account",
      allowNull: true,
    });
  }
}

module.exports = Operation;
