const User = require("../../models/inscription/User");
const Inscription = require("../../models/inscription/Inscription");
//
const { generateOTP } = require("../../../../utils/utils");
const bcrypt = require("bcrypt");
const moment = require("moment");
const uuid = require("uuid");

module.exports = {
  async create(req, res) {
    try {
      const { isRegisterWithPhoneNumber, mail, telephone, sys_role, dates } =
        req.body;

      const checkMail = await User.findOne({
        where: { mail: mail },
      });
      if (checkMail)
        return res.status(400).json({
          status: false,
          message: "The e-mail is already used!",
        });

      const checkPhone = await User.findOne({
        where: { telephone: telephone },
      });
      if (checkPhone)
        return res.status(400).json({
          status: false,
          message: "The Phone number is already used!",
        });

      const sys_id = uuid.v1();
      const user = await User.create({
        mail: mail || "",
        telephone: telephone || "",
        sys_role,
        sys_id,
        is_completed: false,
      });

      if (user) {
        const getCode = generateOTP(6);
        const inscription = await Inscription.create({
          user_id: user.id,
          dates,
          code: getCode,
        });
        if (inscription) {
          return res.status(200).json({
            status: true,
            message: `Enter the OTP Code that you have received from ${
              isRegisterWithPhoneNumber ? "SMS Box" : "E-mail Box"
            }.`,
            user,
            inscription,
          });
        }
      }
      return res.status(400).json({
        status: false,
        message: `Inscription process for the provided ${isRegisterWithPhoneNumber ? "Phone number" : "E-mail address"} failed.`,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: "(CATCH) Inscription process failed.",
        error
      });
    }
  },
  async activate(req, res) {
    try {
      const { id, confirmation_code, is_completed } = req.body;

      const check_subscription = await Subscription.findOne({
        where: { reference_transaction: confirmation_code },
      });

      if (check_subscription) {
        const user = await User.update({ is_completed }, { where: { id: id } });
        return res.status(200).json({
          status: 1,
          message: "Account confirmed and activated successfully.",
          user,
        });
      }

      return res.status(400).json({
        status: 0,
        message: "Account confirmation failed.",
      });
    } catch (error) {
      console.log({ "Error confirmation account ": error });
    }
  },
};
