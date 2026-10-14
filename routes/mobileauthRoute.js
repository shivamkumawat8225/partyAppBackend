const express = require("express");
const router = express.Router();
const { signup, logins, mobilelogin, mobileuserregister } = require("../controllers/authController");

const multer = require("multer");

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File Upload Endpoint
const upload = multer({ storage });
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.status(200).json({
    message: "File uploaded successfully",
    filename: req.file.filename,
  });
});
router.get("/", (req, res) => {
  res.send("Get all workouts");
});

router.post("/login", mobilelogin);
router.post("/userregistration", mobileuserregister);
router.post("/weblogin", logins);

module.exports = router;
