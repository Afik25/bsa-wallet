const { Model, DataTypes } = require("sequelize");

class Program extends Model {
  static init(sequelize) {
    super.init(
      {
        title: DataTypes.STRING,
        language: DataTypes.STRING,
        country: DataTypes.STRING,
        status: DataTypes.INTEGER,
        updated_at: DataTypes.DATE,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: "programs",
      }
    );
  }

  static associate(models) {
    this.hasMany(models.Level, {
      foreignKey: "program_id",
      as: "program_level",
      allowNull: false,
    });
  }
}
module.exports = Program;
