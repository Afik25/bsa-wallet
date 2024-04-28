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
      const { level, title, description } = req.body;

      const check_title = await Course.findOne({
        where: {
          [Op.and]: [{ title: title.toLowerCase() }, { level_id: level }],
        },
      });
      if (check_title) {
        return res
          .status(400)
          .json({ status: 0, message: "Le course exists already." });
      }

      const course_count = await Course.count();
      // MC stand for MASOMO COURSE
      var code =
        "MC" +
        course_count +
        "-" +
        (new Date().getMonth() + 1) +
        "" +
        new Date().getDate() +
        "" +
        new Date().getFullYear() +
        "" +
        new Date().getSeconds() +
        "" +
        new Date().getHours() +
        "" +
        new Date().getMinutes();
      //
      const course = await Course.create({
        level_id: level,
        code,
        title: title.toLowerCase(),
        timing: 0,
        description: description.toLowerCase(),
      });
      return res.status(200).json({
        status: 1,
        message: `The course of ${title.toUpperCase()} have been successfully saved.`,
        course,
      });
    } catch (error) {
      console.log({ "catch error create course ": error });
    }
  },
  async get(req, res) {
    try {
      const courses = await Course.findAll();
      if (courses == "" || courses == null) {
        return res.status(200).json({
          status: 0,
          length: 0,
          message: "No information about course available.",
        });
      }
      // sort the levels
      const _courses = courses.sort((a, b) => {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;

        return 0;
      });
      return res
        .status(200)
        .json({ status: 1, length: courses.length, courses: _courses });
    } catch (error) {
      console.log({ "catch error get course ": error });
    }
  },
  async getCustomized(req, res) {
    try {
      const programs = await Program.findAll();
      const levels = await Level.findAll();
      const courses = await Course.findAll();
      if (
        programs == "" ||
        programs == null ||
        levels == "" ||
        levels == null ||
        courses == "" ||
        courses == null
      ) {
        return res.status(200).json({
          status: 0,
          length: 0,
          message: "No information about course available.",
        });
      }
      const customizedCourses = [];
      var _programsLevels = [];
      var _levelsCourses = [];
      for (let i = 0; i < programs.length; i++) {
        const _levels = levels.filter((el) => el.program_id == programs[i].id);

        for (let j = 0; j < _levels.length; j++) {
          const _getCourses = courses.filter(
            (el) => el.level_id == _levels[j].id
          );
          _levelsCourses.push({ level: _levels[j], courses: _getCourses });
        }
        _programsLevels.push({
          program_id: programs[i].id,
          program_title: programs[i].title,
          program_language: programs[i].language,
          levels: _levelsCourses,
        });

        const isFound = customizedCourses?.some((element) => {
          if (element.country === programs[i].country) {
            return true;
          }
          return false;
        });
        //
        if (isFound) {
          const objIndex = customizedCourses.findIndex(
            (element) => element.country === programs[i].country
          );
          customizedCourses[objIndex].content.push(..._programsLevels);
        } else {
          customizedCourses.push({
            country: programs[i].country,
            content: _programsLevels,
          });
        }
        _programsLevels = [];
        _levelsCourses = [];
      }
      // sort the customized courses
      const _customizedCourses = customizedCourses.sort((a, b) => {
        if (a.country < b.country) return -1;
        if (a.country > b.country) return 1;

        return 0;
      });
      return res.status(200).json({
        status: 1,
        length: _customizedCourses.length,
        customizedCourses: _customizedCourses,
      });
    } catch (error) {
      console.log({ "catch error get customized course ": error });
    }
  },
  async getCustomizedByLevels(req, res) {
    try {
      const { level_id } = req.query;
      const levels = await (isEmpty(level_id)
        ? Level.findAll()
        : Level.findOne({ where: { id: parseInt(level_id) } }));
      const courses = await Course.findAll();
      const lessons = await Lesson.findAll();
      const exercises = await Exercice.findAll();
      const solutions = await Solution.findAll();
      const sections = await Section.findAll();
      if (levels == "" || levels == null || courses == "" || courses == null) {
        return res.status(200).json({
          status: 0,
          length: 0,
          message: "No information about course available yet.",
        });
      }
      var _levels = [];
      var _courses = [];
      var _lessons = [];
      var _exercises = [];
      var _solutions = [];
      //
      var totalLessons = 0;
      var totalExercises = 0;

      for (let i = 0; i < levels.length; i++) {
        const _getCourses = courses.filter((el) => el.level_id == levels[i].id);
        for (let j = 0; j < _getCourses.length; j++) {
          const _getLessons = lessons.filter(
            (el) => el.course_id == _getCourses[j].id
          );
          totalLessons = _getLessons.length;
          for (let k = 0; k < _getLessons.length; k++) {
            const _getExercises = exercises.filter(
              (el) => el.lesson_id == _getLessons[k].id
            );
            totalExercises = totalExercises + _getExercises.length;
            const _getSectionLessons = sections.filter(
              (el) => el.lesson_id == _getLessons[k].id
            );
            for (let l = 0; l < _getExercises.length; l++) {
              const _getSolutions = solutions.filter(
                (el) => el.exercise_id == _getExercises[l].id
              );
              const _getSectionExercises = sections.filter(
                (el) => el.exercise_id == _getExercises[l].id
              );
              for (let m = 0; m < _getSolutions.length; m++) {
                const _getSectionSolutions = sections.filter(
                  (el) => el.solution_id == _getSolutions[m].id
                );
                _solutions.push({
                  solution: _getSolutions[m],
                  solution_sections: _getSectionSolutions,
                });
              }
              _exercises.push({
                exercise: _getExercises[l],
                execise_sections: _getSectionExercises,
                exercise_solutions: _solutions,
              });
              _solutions = [];
            }
            _lessons.push({
              lesson: _getLessons[k],
              lesson_sections: _getSectionLessons,
              lesson_exercises: _exercises,
            });
            _exercises = [];
          }
          _courses.push({
            course: _getCourses[j],
            total_lessons: totalLessons,
            total_exercises: totalExercises,
            course_lessons: _lessons,
          });
          _lessons = [];
          totalLessons = 0;
          totalExercises = 0;
        }
        _levels.push({ level: levels[i], level_courses: _courses });
        _courses = [];
      }
      return res.status(200).json({
        status: 1,
        length: _levels.length,
        customizedCoursesByLevels: _levels,
      });
    } catch (error) {
      console.log({ "catch error get customized course by levels ": error });
    }
  },
  async getAll(req, res) {
    try {
      const levels = await Level.findAll();
      const courses = await Course.findAll();
      const lessons = await Lesson.findAll();
      const exercices = await Exercice.findAll();
      const solutions = await Solution.findAll();

      let distinc_lessons_arr = [];
      for (let i = 0; i < lessons.length; i++) {
        let obj = distinc_lessons_arr.find(
          (el) =>
            el?.course_id === lessons[i].course_id &&
            el?.level_id === lessons[i].level_id
        );

        if (!obj) {
          distinc_lessons_arr.push(lessons[i]);
        }
      }

      let allcourses = [];
      let arr_courses = [];
      for (let i = 0; i < levels.length; i++) {
        for (let j = 0; j < distinc_lessons_arr.length; j++) {
          if (levels[i].id === distinc_lessons_arr[j].level_id) {
            let obj_course = courses.find(
              (el) => el.id === distinc_lessons_arr[j].course_id
            );
            //
            const countLessons = await Lesson.count({
              where: {
                [Op.and]: [
                  { course_id: distinc_lessons_arr[j].course_id },
                  { level_id: distinc_lessons_arr[j].level_id },
                ],
              },
            });
            const countExercices = await Exercice.count({
              where: {
                lesson_id: distinc_lessons_arr[j].id,
              },
            });
            //
            arr_courses.push({
              level_id: distinc_lessons_arr[j].level_id,
              id: obj_course.id,
              code: obj_course.code,
              title: obj_course.title,
              total_lessons: countLessons,
              total_exercices: countExercices,
              status: obj_course.status,
              description: obj_course.description,
            });
          }
        }
        //
        allcourses.push({
          id: levels[i].id,
          title: levels[i].title,
          courses: arr_courses,
        });
        //
        arr_courses = [];
      }

      return res
        .status(200)
        .json({ allcourses, levels, courses, lessons, exercices, solutions });
    } catch (error) {
      console.log({ "catch error get all courses ": error });
    }
  },
  async getByKey(req, res) {
    try {
      const { key } = req.params;

      const course = await Course.findAll({ where: { id: key } });
      if (!course) {
        return res.status.json({
          status: 0,
          length: 0,
          message: `No information available about the course key ${key}.`,
        });
      }

      return res.status(200).json({ status: 1, length: course.length, course });
    } catch (error) {
      console.log({ "catch error get course by key ": error });
    }
  },
  async update(req, res) {
    try {
      const { code, title, type, description } = req.body;
      const thumbnails = req?.file?.filename || "user.png";
      const { course_id } = req.params;

      const check_title = await Course.findOne({
        where: { title: title },
      });
      if (check_title) {
        return res
          .status(400)
          .json({ status: 0, message: "Le cours renseigné existe déjà." });
      }

      const courseUpdated = await CourseModel.update(
        {
          code,
          title,
          type,
          description,
          thumbnails,
        },
        { where: { id: course_id } }
      );

      return res.status(200).json({
        status: 1,
        message: `Les informations relatives au cours de ${title.toUpperCase()} ont bien étaient mise à jour.`,
        courseUpdated,
      });
    } catch (error) {
      console.log({ "catch error update course ": error });
    }
  },
  async activation(req, res) {
    try {
      const { id, status } = req.body;

      const course = await Course.update(
        { status: status === 1 ? 0 : 1 },
        { where: { id: id } }
      );

      if (course) {
        return res.status(200).json({
          status: 1,
          message: `The related course's status is successfully updated.`,
          course,
        });
      }
      return res.status(400).json({
        status: 0,
        message: `The related course's status (${
          status === 1 ? "desactivation" : "activation"
        }) is not updated.`,
      });
    } catch (error) {
      console.log({
        "Error update activation/desactivation process of course ": error,
      });
    }
  },
  async delete(req, res) {
    try {
      const { course_id } = req.params;
      await Course.destroy({ where: { id: course_id } });
      return res
        .status(200)
        .json({ status: 1, message: "Le cours a bien été supprimé." });
    } catch (error) {
      console.log({ "catch error delete course ": error });
    }
  },
};
