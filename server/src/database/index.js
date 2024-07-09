const sequelize = require("sequelize");
const database = require("../config/database");
const connection = new sequelize(database);
//
const User = require("../api/v1/models/authentication/User");
const Inscription = require("../api/v1/models/authentication/Inscription");
const Login = require("../api/v1/models/authentication/Login");
const Room = require("../api/v1/models/authentication/Room");
const Account = require("../api/v1/models/operations/Account");
const Operation = require("../api/v1/models/operations/Operation");
//
// Models connection links
//
User.init(connection);
Inscription.init(connection);
Login.init(connection);
Room.init(connection);
Account.init(connection);
Operation.init(connection);

module.exports = connection;
