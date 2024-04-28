// libraries
const express = require("express");
const path = require("path");
const cors = require("cors");
const logger = require("morgan");
require("dotenv").config("./.env");
require("./database");
const credentials = require("./middlewares/credentials");
const corsOptions = require("./middlewares/corsOptions");
const cookieParser = require("cookie-parser");
const logEvents = require("./middlewares/logEvents");
const routes = require("./routes");
//
// extensions
const app = express();
const PORT = process.env.PORT || 9999;

// middlewares
app.use(logger("dev"));
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  logEvents(
    `${req.headers.host}\t${req.method}\t${req.headers.origin}\t${req.url}`,
    "reqLog.txt"
  );
  next();
});
app.use("/api/v1", routes);
app.use(express.static(path.join(__dirname, "/files")));
//
app.listen(PORT, () => console.log(`Server started at PORT : ${PORT}`));
