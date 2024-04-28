const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config(path.join(__dirname, "", ".env"));

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded.userInfo.user_id;
    next();
  });
};
module.exports = verifyJWT;
