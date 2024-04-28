const express = require("express");
const router = express.Router();
const verifyJWT = require("../middlewares/verifyJWT");
const uploadFiles = require("../middlewares/uploadFiles");
const countries = require("../middlewares/countries.json");
//
const User = require("../api/v1/controllers/inscription/User");
const Inscription = require("../api/v1/controllers/inscription/Inscription");
const Login = require("../api/v1/controllers/login/Login");
//
// root configure
router.get("/auth/config", User.config);
//
router.get("/countries", function (req, res) {
  res.status(200).json({ countries });
});
//
// Inscription
router.post("/auth/register", Inscription.create);
router.post("/auth/register/activation", Inscription.activate);
//
// login
router.post("/auth/login", Login.login);
router.get("/auth/refresh", Login.refreshToken);
router.get("/auth/logout", Login.logout);
//

module.exports = router;
