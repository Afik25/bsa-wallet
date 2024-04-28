const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const createFolder = async (folderName) => {
  try {
    if (!fs.existsSync(path.join(__dirname, "..", folderName))) {
      await fsPromises.mkdir(path.join(__dirname, "..", folderName));
    }
  } catch (error) {
    console.log({ "logEvents error ": error });
  }
};

const generateOTP = () => {
  // Declare a digits variable
  // which stores all digits
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

const generatePassword = (length) => {
  // Declare a digits variable
  // which stores all digits
  var digits = "0123456789AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += digits[Math.floor(Math.random() * 62)];
  }
  return password;
};

const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "object" && Object.entries(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
};

const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

module.exports = { generatePassword, generateOTP, createFolder, isEmpty, capitalize };
