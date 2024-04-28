const express = require("express");
const router = express.Router();
const verifyJWT = require("../middlewares/verifyJWT");
const uploadFiles = require("../middlewares/uploadFiles");
const countries = require("../middlewares/countries.json");
//
const User = require("../api/v1/controllers/inscription/User");
const Program = require("../api/v1/controllers/inscription/Program");
const Level = require("../api/v1/controllers/inscription/Level");
const Inscription = require("../api/v1/controllers/inscription/Inscription");
const Course = require("../api/v1/controllers/course/Course");
const Lesson = require("../api/v1/controllers/course/Lesson");
const Exercice = require("../api/v1/controllers/course/Exercice");
const Solution = require("../api/v1/controllers/course/Solution");
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
router.post("/auth/complete", Inscription.complete);
router.post("/auth/complete/program", Inscription.completeProgram);
router.post("/auth/activation", Inscription.activateCompletion);
//
// login
router.post("/auth/login", Login.login);
router.get("/auth/refresh", Login.refreshToken);
router.get("/auth/logout", Login.logout);
//
// program and levels
router
  .post("/programs", Program.create)
  .post("/programs/activation", Program.activation)
  .get("/programs", Program.get)
  .get("/programs/customized", Program.getCustomized);
router
  .post("/levels", Level.create)
  .post("/levels/activation", Level.activation)
  .get("/levels", Level.get)
  .get("/levels/customized", Level.getCustomized);
//
// course
router
  .post("/courses", Course.create)
  .post("/courses/activation", Course.activation)
  .get("/courses", Course.get);
router.get("/courses/customized", Course.getCustomized);
router.get("/courses/customized/by/levels", Course.getCustomizedByLevels);
router.get("/courses/all", Course.getAll);
//
// Lesson
router
  .post(
    "/courses/lessons",
    uploadFiles.upload.array("thumbnailsImages"),
    Lesson.create
  )
  .post("/courses/lessons/activation", Lesson.activation)
  .get("/courses/lessons", Lesson.get);
router.get("/courses/lessons/customized", Lesson.getCustomized);
//
// Exercises
router
  .post(
    "/courses/lessons/exercises",
    uploadFiles.upload.array("thumbnailsImages"),
    Exercice.create
  )
  .post("/courses/lessons/exercises/activation", Exercice.activation)
  .get("/courses/lessons/exercises", Exercice.get);
router.get("/courses/lessons/exercises/customized", Exercice.getCustomized);
//
// Solutions
router
  .post(
    "/courses/lessons/exercises/solutions",
    uploadFiles.upload.array("thumbnailsImages"),
    Solution.create
  )
  .post("/courses/lessons/exercises/solutions/activation", Solution.activation)
  .get("/courses/lessons/exercises/solutions", Solution.get);
router.get("/courses/lessons/exercises/solutions/customized", Solution.getCustomized);

module.exports = router;
