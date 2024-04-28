const sequelize = require("sequelize");
const database = require("../config/database");
const connection = new sequelize(database);
//
const User = require("../api/v1/models/inscription/User");
const Inscription = require("../api/v1/models/inscription/Inscription");
const Login = require("../api/v1/models/login/Login");
//
// Models connection links
//
User.init(connection);
Inscription.init(connection);
Login.init(connection);

module.exports = connection;
