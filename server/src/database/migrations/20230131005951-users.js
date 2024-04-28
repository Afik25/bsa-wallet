"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      firstname: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lastname: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      telephone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      mail: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      birth: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      birth_location: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      nationality: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sys_role: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sys_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      thumbnails: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          isIn: [[0, 1]],
        },
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.fn("now"),
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("now"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
