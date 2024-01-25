const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Specify the destination folder for uploads
  },
  filename: function (req, file, cb) {
   
    cb(null, file.originalname);
  },
});


const upload = multer({ storage: storage });

module.exports = {upload}
