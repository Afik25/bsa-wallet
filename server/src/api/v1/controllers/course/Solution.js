const Program = require("../../models/inscription/Program");
const Level = require("../../models/course/Level");
const Course = require("../../models/course/Course");
const Lesson = require("../../models/course/Lesson");
const Exercice = require("../../models/course/Exercice");
const Solution = require("../../models/course/Solution");
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

      const check_solution = await Solution.findOne({
        where: {
          [Op.and]: [{ title: title.toLowerCase() }, { exercice_id: key_id }],
        },
      });
      //
      if (isEmpty(check_solution)) {
        const solution_count = await Solution.count({
          where: { exercice_id: key_id },
        });

        var code =
          "MCLES" +
          key_id +
          (solution_count + 1) +
          "-" +
          (new Date().getMonth() + 1) +
          "" +
          new Date().getDate() +
          "" +
          new Date().getSeconds();

        const solution = await Solution.create({
          exercice_id: key_id,
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
            solution_id: solution?.id,
            description: _thumbnails[idx],
            thumbnails: `[${_fileSectionNames}]`,
          });
          _fileSectionNames = [];
        }

        return res.status(200).json({
          status: 1,
          message: `solution related to ${title.toUpperCase()} saved successfully`,
          solution,
        });
      }

      return res.status(400).json({
        status: 0,
        message: `Saving solution related to ${title.toUpperCase()} failed.`,
      });
    } catch (error) {
      console.log({ "Error create solution ": error });
    }
  },
  async get(req, res) {
    try {
      const solutions = await Solution.findAll();
      if (!lessons) {
        return res.status.json({
          status: 0,
          length: 0,
          message: "Aucune information disponible",
        });
      }

      return res
        .status(200)
        .json({ status: 1, length: solutions.length, solutions });
    } catch (error) {
      console.log({ "catch error get solution ": error });
    }
  },
  async getCustomized(req, res) {
    try {
      const programs = await Program.findAll();
      const levels = await Level.findAll();
      const courses = await Course.findAll();
      const lessons = await Lesson.findAll();
      const exercises = await Exercice.findAll();
      const solutions = await Solution.findAll();
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
        solutions == "" ||
        solutions == null ||
        sections == "" ||
        sections == null
      ) {
        return res.status(200).json({
          status: 0,
          length: 0,
          message: "No information about solutions available.",
        });
      }
      const customizedSolutions = [];
      var _programsTabs = [];
      var _levelsTab = [];
      var _coursesTab = [];
      var _lessonsTab = [];
      var _exercisesTab = [];
      var _solutionsTab = [];
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
                const _getSolutions = solutions.filter(
                  (el) => el.exercice_id == _getExercises[k].id
                );
                for (let q = 0; q < _getSolutions.length; q++) {
                  const _getSections = sections.filter(
                    (el) => el.solution_id == _getSolutions[q].id
                  );
                  _solutionsTab.push({
                    solution: _getSolutions[q],
                    solution_sections: _getSections,
                  });
                }
                _exercisesTab.push({
                  exercise: _getExercises[p],
                  exercises_solutions: _solutionsTab,
                });
                _solutionsTab = [];
              }
              _lessonsTab.push({
                lesson: _getLessons[l],
                lesson_solutions: _exercisesTab,
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

        const isFound = customizedSolutions?.some((element) => {
          if (element.country === programs[i].country) {
            return true;
          }
          return false;
        });
        //
        if (isFound) {
          const objIndex = customizedSolutions.findIndex(
            (element) => element.country === programs[i].country
          );
          customizedSolutions[objIndex].content.push(..._programsTabs);
        } else {
          customizedSolutions.push({
            country: programs[i].country,
            content: _programsTabs,
          });
        }
        _programsTabs = [];
        _levelsTab = [];
      }
      // sort the customized solutions
      const _customizedSolutions = customizedSolutions.sort((a, b) => {
        if (a.country < b.country) return -1;
        if (a.country > b.country) return 1;

        return 0;
      });
      return res.status(200).json({
        status: 1,
        length: _customizedSolutions.length,
        customizedSolutions: _customizedSolutions,
      });
    } catch (error) {
      console.log({ "Error get customized solutions ": error });
    }
  },
  async getByKey(req, res) {
    try {
      const { key } = req.params;

      const solution = await Solution.findAll({ where: { id: key } });
      if (!solution) {
        return res.status.json({
          status: 0,
          length: 0,
          message: `Aucune information disponible relative à la solution sur ${key}.`,
        });
      }

      return res
        .status(200)
        .json({ status: 1, length: solution.length, solution });
    } catch (error) {
      console.log({ "catch error get solution by key ": error });
    }
  },
  async update(req, res) {
    try {
      const { code, title, type, description } = req.body;
      const thumbnails = req?.file?.filename || "user.png";
      const { solution_id } = req.params;

      const check_title = await Solution.findOne({
        where: { title: title },
      });
      if (check_title) {
        return res
          .status(400)
          .json({ status: 0, message: "La solution fournie existe déjà." });
      }

      const solutionUpdated = await Solution.update(
        {
          code,
          title,
          type,
          description,
          thumbnails,
        },
        { where: { id: solution_id } }
      );

      return res.status(200).json({
        status: 1,
        message: `Les informations relatives à la solution sur ${title.toUpperCase()} ont bien étaient mise à jour.`,
        solutionUpdated,
      });
    } catch (error) {
      console.log({ "catch error update solution ": error });
    }
  },
  async activation(req, res) {
    try {
      const { id, status } = req.body;

      const course = await Solution.update(
        { status: status === 1 ? 0 : 1 },
        { where: { id: id } }
      );

      if (course) {
        return res.status(200).json({
          status: 1,
          message: `The related solution's status is successfully updated.`,
          course,
        });
      }
      return res.status(400).json({
        status: 0,
        message: `The related solution's status (${
          status === 1 ? "desactivation" : "activation"
        }) is not updated.`,
      });
    } catch (error) {
      console.log({
        "Error update activation/desactivation process of solution ": error,
      });
    }
  },
  async delete(req, res) {
    try {
      const { solution_id } = req.params;
      await Solution.destroy({ where: { id: solution_id } });
      return res
        .status(200)
        .json({ status: 1, message: "La solution a bien été supprimé." });
    } catch (error) {
      console.log({ "catch error delete solution ": error });
    }
  },
};
