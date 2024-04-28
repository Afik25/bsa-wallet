const allowedRequestsOrigins = require("./allowedRequestsOrigins");

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedRequestsOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Origin not allowed by CORS"));
    }
  },
  optionSuccessStatus: 200,
};
module.exports = corsOptions;
