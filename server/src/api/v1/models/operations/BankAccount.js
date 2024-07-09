const { Model, DataTypes } = require("sequelize");

class BankAccount extends Model {
  static init(sequelize) {
    super.init(
      {
        code: DataTypes.STRING,
        type: DataTypes.STRING, // mobile or banking
        names: DataTypes.STRING,
        currency: DataTypes.STRING,
        status: DataTypes.INTEGER,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: "bank_accounts",
      }
    );
  }

  static associate(models) {
    this.hasMany(models.BankAccount, {
      foreignKey: "bank_id",
      as: "wallet_linked",
      allowNull: false,
    });
  }
}

module.exports = BankAccount;
