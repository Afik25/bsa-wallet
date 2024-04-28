const multer = require("multer");
const path = require("path");

const imgArray = ["image/png", "image/jpeg", "image/jpg"];
const pdfArray = ["audio/pdf"];
const audioArray = ["audio/mp3", "audio/wav"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (imgArray.includes(file.mimetype.toLowerCase()))
      cb(null, path.join(__dirname, "../files/", "images"));
    if (pdfArray.includes(file.mimetype.toLowerCase()))
      cb(null, path.join(__dirname, "../files/", "pdf"));
  },
  filename: (req, file, cb) => {
    if (imgArray.includes(file.mimetype.toLowerCase()))
      cb(null, file.originalname);
    if (pdfArray.includes(file.mimetype.toLowerCase()))
      cb(null, file.originalname);
  },
});

const uploadImage = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (imgArray.includes(file.mimetype.toLowerCase())) cb(null, true);
  },
});

module.exports = {
  upload: uploadImage,
};
