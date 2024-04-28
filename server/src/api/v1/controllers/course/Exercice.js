const Program = require("../../models/inscription/Program");
const Level = require("../../models/course/Level");
const Course = require("../../models/course/Course");
const Lesson = require("../../models/course/Lesson");
const Exercice = require("../../models/course/Exercice");
const Section = require("../../models/course/Section");
const { Op } = require("sequelize");
const { isEmpty } = require("../../../../utils/utils");

module.exports = {
  async create(req, res) {
    try {
      const {
        key_id,
        title,
        type,
        language,
        description,
        thumbnails,
        fileSectionNames,
      } = req.body;

      const check_exercise = await Exercice.findOne({
        where: {
          [Op.and]: [{ title: title.toLowerCase() }, { lesson_id: key_id }],
        },
      });
      //
      if (isEmpty(check_exercise)) {
        const exercise_count = await Exercice.count({
          where: { lesson_id: key_id },
        });

        var code =
          "MCLE" +
          key_id +
          (exercise_count + 1) +
          "-" +
          (new Date().getMonth() + 1) +
          "" +
          new Date().getDate() +
          "" +
          new Date().getSeconds();

        const exercise = await Exercice.create({
          lesson_id: key_id,
          code,
          title,
          type,
          timing: 0.0,
          version: language,
          description,
        });
        const _thumbnails =
          typeof thumbnails === "string" ? [`${thumbnails}`] : thumbnails;
        for (let idx = 0; idx < _thumbnails.length; idx++) {
          var _fileSectionNames = [];
          if (!isEmpty(fileSectionNames)) {
            for (let j = 0; j < fileSectionNames.length; j++) {
              const section_number = fileSectionNames[j].split("#")[0];
              const section_file = fileSectionNames[j].split("#")[1];
              if (section_number == idx) {
                _fileSectionNames.push(section_file);
              }
            }
          }
          await Section.create({
            exercise_id: exercise?.id,
            description: _thumbnails[idx],
            thumbnails: `[${_fileSectionNames}]`,
          });
          _fileSectionNames = [];
        }

        return res.status(200).json({
          status: 1,
          message: `Exercise related to ${title.toUpperCase()} saved successfully`,
          exercise,
        });
      }

      return res.status(400).json({
        status: 0,
        message: `Saving exercise related to ${title.toUpperCase()} failed.`,
      });
    } catch (error) {
      console.log({ "Error create exercise ": error });
    }
  },
  async get(req, res) {
    try {
      const exercises = await Exercice.findAll();
      if (!exercises) {
        return res.status.json({
          status: 0,
          length: 0,
          message: "Aucune information disponible",
        });
      }

      return res
        .status(200)
        .json({ status: 1, length: exercises.length, exercises });
    } catch (error) {
      console.log({ "catch error get exercice ": error });
    }
  },
  async getCustomized(req, res) {
    try {
      const programs = await Program.findAll();
      const levels = await Level.findAll();
      const courses = await Course.findAll();
      const lessons = await Lesson.findAll();
      const exercises = await Exercice.findAll();
      const sections = await Section.findAll();
      if (
        programs == "" ||
        programs == null ||
        levels == "" ||
        levels == null ||
        courses == "" ||
        courses == null ||
        lessons == "" ||
        lessons == null ||
        exercises == "" ||
        exercises == null ||
        sections == "" ||
        sections == null
      ) {
        return res.status(200).json({
          status: 0,
          length: 0,
          message: "No information about exercises available.",
        });
      }
      const customizedExercises = [];
      var _programsTabs = [];
      var _levelsTab = [];
      var _coursesTab = [];
      var _lessonsTab = [];
      var _exercisesTab = [];
      for (let i = 0; i < programs.length; i++) {
        const _levels = levels.filter((el) => el.program_id == programs[i].id);

        for (let j = 0; j < _levels.length; j++) {
          const _getCourses = courses.filter(
            (el) => el.level_id == _levels[j].id
          );

          for (let k = 0; k < _getCourses.length; k++) {
            const _getLessons = lessons.filter(
              (el) => el.course_id == _getCourses[k].id
            );
            for (let l = 0; l < _getLessons.length; l++) {
              const _getExercises = exercises.filter(
                (el) => el.lesson_id == _getLessons[k].id
              );
              for (let p = 0; p < _getExercises.length; p++) {
                const _getSections = sections.filter(
                  (el) => el.exercise_id == _getExercises[p].id
                );
                _exercisesTab.push({
                  exercise: _getExercises[p],
                  exercise_sections: _getSections,
                });
              }
              _lessonsTab.push({
                lesson: _getLessons[l],
                lesson_exercises: _exercisesTab,
              });
              _exercisesTab = [];
            }
            _coursesTab.push({
              course: _getCourses[k],
              course_lessons: _lessonsTab,
            });
            _lessonsTab = [];
          }
          _levelsTab.push({ level: _levels[j], level_courses: _coursesTab });
          _coursesTab = [];
        }
        _programsTabs.push({
          program_id: programs[i].id,
          program_title: programs[i].title,
          program_language: programs[i].language,
          levels: _levelsTab,
        });

        const isFound = customizedExercises?.some((element) => {
          if (element.country === programs[i].country) {
            return true;
          }
          return false;
        });
        //
        if (isFound) {
          const objIndex = customizedExercises.findIndex(
            (element) => element.country === programs[i].country
          );
          customizedExercises[objIndex].content.push(..._programsTabs);
        } else {
          customizedExercises.push({
            country: programs[i].country,
            content: _programsTabs,
          });
        }
        _programsTabs = [];
        _levelsTab = [];
      }
      // sort the customized exercises
      const _customizedExercises = customizedExercises.sort((a, b) => {
        if (a.country < b.country) return -1;
        if (a.country > b.country) return 1;

        return 0;
      });
      return res.status(200).json({
        status: 1,
        length: _customizedExercises.length,
        customizedExercises: _customizedExercises,
      });
    } catch (error) {
      console.log({ "Error get customized exercises ": error });
    }
  },
  async getByKey(req, res) {
    try {
      const { key } = req.params;

      const exercice = await Exercice.findAll({ where: { id: key } });
      if (!exercice) {
        return res.status.json({
          status: 0,
          length: 0,
          message: `Aucune information disponible relative à l'exercise sur ${key}.`,
        });
      }

      return res
        .status(200)
        .json({ status: 1, length: exercice.length, exercice });
    } catch (error) {
      console.log({ "catch error get exercice by key ": error });
    }
  },
  async update(req, res) {
    try {
      const { code, title, type, description } = req.body;
      const thumbnails = req?.file?.filename || "user.png";
      const { exercice_id } = req.params;

      const check_title = await Exercice.findOne({
        where: { title: title },
      });
      if (check_title) {
        return res
          .status(400)
          .json({ status: 0, message: "L'exercice renseigné existe déjà." });
      }

      const exerciceUpdated = await Exercice.update(
        {
          code,
          title,
          type,
          description,
          thumbnails,
        },
        { where: { id: exercice_id } }
      );

      return res.status(200).json({
        status: 1,
        message: `Les informations relatives à l'exercise sur ${title.toUpperCase()} ont bien étaient mise à jour.`,
        exerciceUpdated,
      });
    } catch (error) {
      console.log({ "catch error update exercice ": error });
    }
  },
  async activation(req, res) {
    try {
      const { id, status } = req.body;

      const course = await Exercice.update(
        { status: status === 1 ? 0 : 1 },
        { where: { id: id } }
      );

      if (course) {
        return res.status(200).json({
          status: 1,
          message: `The related exercise's status is successfully updated.`,
          course,
        });
      }
      return res.status(400).json({
        status: 0,
        message: `The related exercise's status (${
          status === 1 ? "desactivation" : "activation"
        }) is not updated.`,
      });
    } catch (error) {
      console.log({
        "Error update activation/desactivation process of exercise ": error,
      });
    }
  },
  async delete(req, res) {
    try {
      const { exercice_id } = req.params;
      await Exercice.destroy({ where: { id: exercice_id } });
      return res
        .status(200)
        .json({ status: 1, message: "L'exercise a bien été supprimé." });
    } catch (error) {
      console.log({ "catch error delete exercice ": error });
    }
  },
};
