"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("configurations", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "id" },
        allowNull: false,
      },
      notify_on_update: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      send_weekly_digest: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      tags: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      theme: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      language: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      two_step_verification: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("now"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("configurations");
  },
};
