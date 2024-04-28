require("dotenv").config("../.env");
module.exports = {
  host:
    process.env.APP_ENV === "dev"
      ? process.env.DEV_DB_HOST
      : process.env.APP_ENV === "test"
      ? process.env.TEST_DB_HOST
      : process.env.DB_HOST,
  port:
    process.env.APP_ENV === "dev"
      ? process.env.DEV_DB_PORT
      : process.env.APP_ENV === "test"
      ? process.env.TEST_DB_PORT
      : process.env.DB_PORT,
  dialect:
    process.env.APP_ENV === "dev"
      ? process.env.DEV_DB_DIALECT
      : process.env.APP_ENV === "test"
      ? process.env.TEST_DB_DIALECT
      : process.env.DB_DIALECT,
  dialectModule: require("pg"),
  database:
    process.env.APP_ENV === "dev"
      ? process.env.DEV_DB_DATABASE_NAME
      : process.env.APP_ENV === "test"
      ? process.env.TEST_DB_DATABASE_NAME
      : process.env.DB_NAME,
  username:
    process.env.APP_ENV === "dev"
      ? process.env.DEV_DB_USER
      : process.env.APP_ENV === "test"
      ? process.env.TEST_DB_USER
      : process.env.DB_USER,
  password:
    process.env.APP_ENV === "dev"
      ? process.env.DEV_DB_PASSWORD
      : process.env.APP_ENV === "test"
      ? process.env.TEST_DB_PASSWORD
      : process.env.DB_PASSWORD,
  define: {
    charset: "utf8",
    collate: "utf8_general_ci",
    timestamp: false,
    underscored: true,
  },
  dialectOptions: {},
  pool: {
    max: 5,
    min: 0,
    idle: 20000,
    evict: 15000,
    acquire: 30000,
  },
  dialectOptions: {
    bigNumberStrings: true,
    // it must be decomment for production's mode
    // ssl: {
    //   ca: fs.readFileSync(__dirname + "/mysql-ca-main.crt"),
    // },
  },
};
