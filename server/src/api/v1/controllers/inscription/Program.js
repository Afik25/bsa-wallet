const Program = require("../../models/inscription/Program");
const Level = require("../../models/course/Level");
const Course = require("../../models/course/Course");
const Lesson = require("../../models/course/Lesson");
const Exercice = require("../../models/course/Exercice");
const { Op } = require("sequelize");

module.exports = {
  async create(req, res) {
    try {
      const { title, language, country } = req.body;

      const check_language_country = await Program.findOne({
        where: {
          [Op.and]: [
            { title: title },
            { language: language },
            { country: country },
          ],
        },
      });
      if (check_language_country) {
        return res.status(400).json({
          status: 0,
          message: `The ${title.toUpperCase()} Program in ${language.toUpperCase()} for ${country} exists already!`,
        });
      }

      const program = await Program.create({ title, language, country });

      if (program) {
        return res.status(200).json({
          status: 1,
          message: `The ${title.toUpperCase()} Program in ${language.toUpperCase()} for ${country} is successfully created.`,
          program,
        });
      }
      return res.status(400).json({
        status: 0,
        message: `Process failed!\n\nThe ${title.toUpperCase()} Program in ${language.toUpperCase()} for ${country} is not created.`,
      });
    } catch (error) {
      console.log({ "Error create program : ": error });
    }
  },
  async get(req, res) {
    try {
      const programs = await Program.findAll();
      if (programs == "" || programs == null) {
        return res.status(200).json({
          status: 0,
          length: 0,
          message: "No program available.",
        });
      }
      // sort the Programs
      const _programs = programs.sort((a, b) => {
        if (a.country < b.country) return -1;
        if (a.country > b.country) return 1;

        return 0;
      });
      return res
        .status(200)
        .json({ status: 1, length: programs.length, programs: _programs });
    } catch (error) {
      console.log({ "Error get programs ": error });
    }
  },
  async getByKey(req, res) {
    try {
      const { key } = req.params;

      const program = await Program.findAll({ where: { id: key } });
      if (!program) {
        return res.status.json({
          status: 0,
          length: 0,
          message: "No program available for the specified key.",
        });
      }

      return res
        .status(200)
        .json({ status: 1, length: program.length, program });
    } catch (error) {
      console.log({ "Error get Program by key ": error });
    }
  },
  async getCustomized(req, res) {
    try {
      const programs = await Program.findAll();
      const levels = await Level.findAll();
      const courses = await Course.findAll();
      const lessons = await Lesson.findAll();
      const exercices = await Exercice.findAll();
      const customizedPrograms = [];

      if (programs == "" || programs == null) {
        return res.status(200).json({
          status: 0,
          length: customizedPrograms.length,
          message: "No customized programs available.",
        });
      }

      if (programs != null) {
        if (levels != null) {
          if (courses != null) {
            if (lessons != null) {
              if (exercices != null) {
                for (let i = 0; i < programs.length; i++) {
                  let count_levels = levels.filter(
                    (item) => item.program_id === programs[i].id
                  );
                  let total_courses = 0;
                  let total_courses_timing = 0;
                  let total_lessons = 0;
                  let total_lessons_timing = 0;
                  let total_exercises = 0;
                  let total_exercises_timing = 0;
                  for (let j = 0; j < count_levels.length; j++) {
                    let count_courses = courses.filter(
                      (item) => item.level_id === count_levels[j].id
                    );
                    total_courses += count_courses.length;
                    for (let k = 0; k < count_courses.length; k++) {
                      total_courses_timing += count_courses[k].timing;

                      let count_lessons = lessons.filter(
                        (item) => item.course_id === count_courses[k].id
                      );
                      total_lessons += count_lessons.length;
                      for (let l = 0; l < count_lessons.length; l++) {
                        total_lessons_timing += count_lessons[l].timing;

                        let count_exercises = exercices.filter(
                          (item) => item.lesson_id === count_lessons[l].id
                        );
                        total_exercises += count_exercises.length;
                        for (let m = 0; m < count_exercises.length; m++) {
                          total_exercises_timing += count_exercises[m].timing;
                        }
                      }
                    }
                  }
                  customizedPrograms.push({
                    program_id: programs[i].id,
                    program_title: programs[i].title,
                    program_country: programs[i].country,
                    program_language: programs[i].language,
                    program_status: programs[i].status,
                    total_levels: count_levels.length,
                    courses: {
                      total: total_courses,
                      timing: total_courses_timing,
                    },
                    lessons: {
                      total: total_lessons,
                      timing: total_lessons_timing,
                    },
                    exercices: {
                      total: total_exercises,
                      timing: total_exercises_timing,
                    },
                  });
                }
              } else {
                for (let i = 0; i < programs.length; i++) {
                  let count_levels = levels.filter(
                    (item) => item.program_id === programs[i].id
                  );
                  let total_courses = 0;
                  let total_courses_timing = 0;
                  let total_lessons = 0;
                  let total_lessons_timing = 0;
                  for (let j = 0; j < count_levels.length; j++) {
                    let count_courses = courses.filter(
                      (item) => item.level_id === count_levels[j].id
                    );
                    total_courses += count_courses.length;
                    for (let k = 0; k < count_courses.length; k++) {
                      total_courses_timing += count_courses[k].timing;

                      let count_lessons = lessons.filter(
                        (item) => item.course_id === count_courses[k].id
                      );
                      total_lessons += count_lessons.length;
                      for (let l = 0; l < count_lessons.length; l++) {
                        total_lessons_timing += count_lessons[l].timing;
                      }
                    }
                  }
                  customizedPrograms.push({
                    program_id: programs[i].id,
                    program_title: programs[i].title,
                    program_country: programs[i].country,
                    program_language: programs[i].language,
                    program_status: programs[i].status,
                    total_levels: count_levels.length,
                    courses: {
                      total: total_courses,
                      timing: total_courses_timing,
                    },
                    lessons: {
                      total: total_lessons,
                      timing: total_lessons_timing,
                    },
                    exercices: {
                      total: 0,
                      timing: 0,
                    },
                  });
                }
              }
            } else {
              for (let i = 0; i < programs.length; i++) {
                let count_levels = levels.filter(
                  (item) => item.program_id === programs[i].id
                );
                let total_courses = 0;
                let total_courses_timing = 0;
                for (let j = 0; j < count_levels.length; j++) {
                  let count_courses = courses.filter(
                    (item) => item.level_id === count_levels[j].id
                  );
                  total_courses += count_courses.length;
                  for (let k = 0; k < count_courses.length; k++) {
                    total_courses_timing += count_courses[k].timing;
                  }
                }
                customizedPrograms.push({
                  program_id: programs[i].id,
                  program_title: programs[i].title,
                  program_country: programs[i].country,
                  program_language: programs[i].language,
                  program_status: programs[i].status,
                  total_levels: count_levels.length,
                  courses: {
                    total: total_courses,
                    timing: total_courses_timing,
                  },
                  lessons: {
                    total: 0,
                    timing: 0,
                  },
                  exercices: {
                    total: 0,
                    timing: 0,
                  },
                });
              }
            }
          } else {
            for (let i = 0; i < programs.length; i++) {
              let count_level = levels.filter(
                (item) => item.program_id === programs[i].id
              );
              customizedPrograms.push({
                program_id: programs[i].id,
                program_title: programs[i].title,
                program_country: programs[i].country,
                program_language: programs[i].language,
                program_status: programs[i].status,
                total_levels: count_level.length,
                courses: {
                  total: 0,
                  timing: 0,
                },
                lessons: {
                  total: 0,
                  timing: 0,
                },
                exercices: {
                  total: 0,
                  timing: 0,
                },
              });
            }
          }
        } else {
          for (let i = 0; i < programs.length; i++) {
            customizedPrograms.push({
              program_id: programs[i].id,
              program_title: programs[i].title,
              program_country: programs[i].country,
              program_language: programs[i].language,
              program_status: programs[i].status,
              total_levels: 0,
              courses: {
                total: 0,
                timing: 0,
              },
              lessons: {
                total: 0,
                timing: 0,
              },
              exercices: {
                total: 0,
                timing: 0,
              },
            });
          }
        }
      }
      // sort the customizedProgram
      const _customizedPrograms = customizedPrograms.sort((a, b) => {
        if (a.program_country < b.program_country) return -1;
        if (a.program_country > b.program_country) return 1;

        return 0;
      });

      return res.status(200).json({
        status: 1,
        length: customizedPrograms.length,
        customizedPrograms: _customizedPrograms,
      });
    } catch (error) {
      console.log({ "Error get customized programs ": error });
    }
  },
  async update(req, res) {
    try {
      const { title, language, country } = req.body;
      const { id } = req.params;

      const check_language_country = await Program.findOne({
        where: { [Op.and]: [{ language: language }, { country: country }] },
      });
      if (check_language_country) {
        return res.status(400).json({
          status: 0,
          message: `The ${language} Program for ${country} exists already!`,
        });
      }

      const program = await Program.update(
        { title, language, country },
        { where: { id: id } }
      );

      if (program) {
        return res.status(200).json({
          status: 1,
          message: `The ${language} Program for ${country} is successfully updated.`,
          program,
        });
      }
      return res.status(400).json({
        status: 0,
        message: `Failed operation!\n\nThe ${language} Program for ${country} is not updated.`,
      });
    } catch (error) {
      console.log({ "Error update Program ": error });
    }
  },
  async activation(req, res) {
    try {
      const { id, status } = req.body;

      const program = await Program.update(
        { status: status === 1 ? 0 : 1 },
        { where: { id: id } }
      );

      if (program) {
        return res.status(200).json({
          status: 1,
          message: `The related Program's status is successfully updated.`,
          program,
        });
      }
      return res.status(400).json({
        status: 0,
        message: `The related Program's status (${
          status === 1 ? "desactivation" : "activation"
        }) is not updated.`,
      });
    } catch (error) {
      console.log({ "Error update Program ": error });
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.params;
      await Program.destroy({ where: { id: id } });
      return res
        .status(200)
        .json({ status: 1, message: "The Program has been deleted." });
    } catch (error) {
      console.log({ "Error delete Program ": error });
    }
  },
};
