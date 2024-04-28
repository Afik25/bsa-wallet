const Program = require("../../models/inscription/Program");
const Level = require("../../models/course/Level");
const { Op } = require("sequelize");
const { v4: uuid } = require("uuid");

module.exports = {
  async create(req, res) {
    try {
      const { program_id, title, description } = req.body;
      const code = uuid();

      const check_program_id_title = await Level.findOne({
        where: { [Op.and]: [{ program_id: program_id }, { title: title.toLowerCase() }] },
      });
      if (check_program_id_title) {
        return res.status(400).json({
          status: 0,
          message: `The level ${title} for the mentioned program exists already!`,
        });
      }

      const level = await Level.create({
        program_id,
        code,
        title: title.toLowerCase(),
        description: description.toLowerCase(),
      });

      if (level) {
        return res.status(200).json({
          status: 1,
          message: `The level ${title} for the mentioned program is successfully saved.`,
          level,
        });
      }
      return res.status(400).json({
        status: 0,
        message: `Failed operation!\n\nThe level ${title} for the mentioned program is not saved.`,
      });
    } catch (error) {
      console.log({ "catch error create level : ": error });
    }
  },
  async get(req, res) {
    try {
      const levels = await Level.findAll();
      if (levels == "" || levels == null) {
        return res.status(200).json({
          status: 0,
          length: 0,
          message: "No information about levels available.",
        });
      }
      // sort the levels
      const _levels = levels.sort((a, b) => {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;

        return 0;
      });
      return res
        .status(200)
        .json({ status: 1, length: levels.length, levels: _levels });
    } catch (error) {
      console.log({ "catch error get levels ": error });
    }
  },
  async getByKey(req, res) {
    try {
      const { key } = req.params;

      const level = await Level.findAll({ where: { id: key } });
      if (!level) {
        return res.status.json({
          status: 0,
          length: 0,
          message: `No information available.`,
        });
      }

      return res.status(200).json({ status: 1, length: level.length, level });
    } catch (error) {
      console.log({ "catch error get Level by key ": error });
    }
  },
  async getCustomized(req, res) {
    try {
      const programs = await Program.findAll();
      const levels = await Level.findAll();
      const customizedLevels = [];

      if (
        programs == "" ||
        programs == null ||
        levels == "" ||
        levels == null
      ) {
        return res.status(200).json({
          status: 0,
          length: customizedLevels.length,
          message: "No customized levels available.",
        });
      }

      if (programs != null) {
        if (levels != null) {
          for (let i = 0; i < programs.length; i++) {
            for (let j = 0; j < levels.length; j++) {
              if (programs[i].id === levels[j].program_id) {
                customizedLevels.push({
                  program_id: programs[i].id,
                  program_title: programs[i].title,
                  program_country: programs[i].country,
                  program_language: programs[i].language,
                  program_status: programs[i].status,
                  level_id: levels[j].id,
                  level_title: levels[j].title,
                  level_status: levels[j].status,
                });
              }
            }
          }
          // sort the customizedLevel
          const _customizedLevels = customizedLevels.sort((a, b) => {
            if (a.program_country < b.program_country) return -1;
            if (a.program_country > b.program_country) return 1;
            return 0;
          });

          return res.status(200).json({
            status: 1,
            length: customizedLevels.length,
            customizedLevels: _customizedLevels,
          });
        }
      }
    } catch (error) {
      console.log({ "Error get customized levels ": error });
    }
  },
  async update(req, res) {
    try {
      const { program_id, title, description } = req.body;
      const { id } = req.params;

      const check_program_id_title = await Level.findOne({
        where: { [Op.and]: [{ program_id: program_id }, { title: title }] },
      });
      if (check_program_id_title) {
        return res.status(400).json({
          status: 0,
          message: `The level ${title} for the mentioned program exists already!`,
        });
      }

      const level = await Level.update(
        { program_id, title, description },
        { where: { id: id } }
      );

      if (level) {
        return res.status(200).json({
          status: 1,
          message: `The level ${title} for the mentioned program is successfully updated.`,
          level,
        });
      }
      return res.status(400).json({
        status: 0,
        message: `Failed operation!\n\nThe level ${title} for the mentioned program is not updated.`,
      });
    } catch (error) {
      console.log({ "catch error update Level ": error });
    }
  },
  async activation(req, res) {
    try {
      const { id, status } = req.body;

      const level = await Level.update(
        { status: status === 1 ? 0 : 1 },
        { where: { id: id } }
      );

      if (level) {
        return res.status(200).json({
          status: 1,
          message: `The related level's status is successfully updated.`,
          level,
        });
      }
      return res.status(400).json({
        status: 0,
        message: `The related level's status (${
          status === 1 ? "desactivation" : "activation"
        }) is not updated.`,
      });
    } catch (error) {
      console.log({ "Error update level ": error });
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.params;
      await Level.destroy({ where: { id: id } });
      return res
        .status(200)
        .json({ status: 1, message: "The Level has been deleted." });
    } catch (error) {
      console.log({ "catch error delete Level ": error });
    }
  },
};
