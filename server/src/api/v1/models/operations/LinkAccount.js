const { Model, DataTypes } = require("sequelize");

class LinkAccount extends Model {
  static init(sequelize) {
    super.init(
      {
        wallet_id: DataTypes.INTEGER,
        bank_id: DataTypes.INTEGER,
        dates: DataTypes.DATE,
        status: DataTypes.INTEGER,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: "link_accounts",
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.WalletAccount, {
      foreignKey: "wallet_id",
      as: "linked_wallet",
      allowNull: false,
    });
    this.belongsTo(models.BankAccount, {
      foreignKey: "bank_id",
      as: "linked_wallet",
      allowNull: false,
    });
  }
}

module.exports = LinkAccount;
