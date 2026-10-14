const express = require("express");
// const router = express.Router();
const user = express();
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const importController = require("../controllers/importController");

user.use(bodyParser.urlencoded({ extended: true }));
user.use(express.static(path.resolve(__dirname, "public")));
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });
user.post("/importUser", upload.single("file"), importController.importuser);
user.post("/importKayakarta", upload.single("file"), importController.importkaryakarta);
user.post("/importFamily", upload.single("file"), importController.importFamily);
user.post("/importVoter", upload.single("file"), importController.importFamilyvoter);
user.post("/importCaste", upload.single("file"), importController.importCaste);
module.exports = user;
