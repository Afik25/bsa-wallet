const User = require("../../models/authentication/User");
const Inscription = require("../../models/authentication/Inscription");
const Account = require("../../models/operations/Account");
//
const { generateOTP } = require("../../../../utils/utils");
const moment = require("moment");
const uuid = require("uuid");

module.exports = {
  async create(req, res) {
    try {
      const {
        isReceivedOtpFromMail,
        firstname,
        lastname,
        username,
        telephone,
        mail,
        sys_role,
        dates,
        location,
        latitude,
        longitude,
        device,
        ip_address,
        operating_system,
        navigator,
      } = req.body;

      const checkUsername =
        username &&
        (await User.findOne({
          where: { username: username },
        }));
      if (checkUsername)
        return res.status(400).json({
          status: false,
          message: "The User ID is not available!",
        });

      const checkPhone =
        telephone &&
        (await User.findOne({
          where: { telephone: telephone },
        }));
      if (checkPhone)
        return res.status(400).json({
          status: false,
          message: "The Phone number is already used!",
        });

      const checkMail =
        mail &&
        (await User.findOne({
          where: { mail: mail },
        }));
      if (checkMail)
        return res.status(400).json({
          status: false,
          message: "The e-mail address is already used!",
        });

      const sys_id = uuid.v1();
      const user = await User.create({
        firstname,
        lastname,
        username,
        telephone: telephone || "",
        mail: mail || "",
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
          location,
          latitude,
          longitude,
          device,
          ip_address,
          operating_system,
          navigator,
        });
        if (inscription) {
          const accountCode = generateOTP(16);
          await Account.create({
            user_id: user.id,
            code: accountCode,
            currency: "USD",
          });
          return res.status(200).json({
            status: true,
            message:
              "Inscription temporarly done. \n Enter the OTP Code that you have received within your SMS Box or E-mail Box.",
            user,
            inscription,
            getCode,
          });
        }
      }
      return res.status(400).json({
        status: false,
        message: `Inscription process for ${firstname} failed.`,
      });
    } catch (error) {
      console.log({ "Error Inscription process ": error });
      return res.status(400).json({
        status: false,
        message: "(CATCH) Inscription process failed.",
        error,
      });
    }
  },
  async resend(req, res) {
    try {
      const {
        inscription,
        location,
        latitude,
        longitude,
        device,
        ip_address,
        operating_system,
        navigator,
      } = req.body;

      const inscriptionUpdate = await Inscription.update(
        {
          location,
          latitude,
          longitude,
          device,
          ip_address,
          operating_system,
          navigator,
        },
        { where: { id: inscription.id } }
      );
      if (inscriptionUpdate) {
        return res.status(200).json({
          status: true,
          message: "Account confirmed and activated successfully.",
          inscriptionUpdate,
        });
      }
      return res.status(400).json({
        status: false,
        message: "Account confirmation failed.",
      });
    } catch (error) {
      console.log({ "Error confirmation account ": error });
      return res.status(400).json({
        status: false,
        message: "(CATCH) Account confirmation process failed.",
        error,
      });
    }
  },
  async activate(req, res) {
    try {
      const {
        inscription,
        location,
        latitude,
        longitude,
        device,
        ip_address,
        operating_system,
        navigator,
      } = req.body;

      const inscriptionUpdate = await Inscription.update(
        {
          location,
          latitude,
          longitude,
          device,
          ip_address,
          operating_system,
          navigator,
        },
        { where: { id: inscription.id } }
      );
      if (inscriptionUpdate) {
        return res.status(200).json({
          status: true,
          message: "Account confirmed and activated successfully.",
          inscriptionUpdate,
        });
      }
      return res.status(400).json({
        status: false,
        message: "Account confirmation failed.",
      });
    } catch (error) {
      console.log({ "Error confirmation account ": error });
      return res.status(400).json({
        status: false,
        message: "(CATCH) Account confirmation process failed.",
        error,
      });
    }
  },
};
