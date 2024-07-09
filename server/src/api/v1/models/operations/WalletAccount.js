const { Model, DataTypes } = require("sequelize");

class WalletAccount extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: DataTypes.INTEGER,
        code: DataTypes.STRING,
        currency: DataTypes.STRING,
        status: DataTypes.INTEGER,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: "wallet_accounts",
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "account_user",
      allowNull: false,
    });
    this.hasMany(models.Operation, {
      foreignKey: "emeter_account_id",
      as: "operation_emeter_account",
      allowNull: false,
    });
    this.hasMany(models.Operation, {
      foreignKey: "receiver_account_id",
      as: "operation_receiver_account",
      allowNull: false,
    });
    this.hasMany(models.LinkAccount, {
      foreignKey: "wallet_id",
      as: "wallet_linked",
      allowNull: false,
    });
  }
}

module.exports = WalletAccount;
