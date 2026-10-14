const express = require("express");
const router = express.Router();
const authController = require("../../controllers/v2/authController");

// File Upload Endpoint

router.get("/", (req, res) => {
  res.send("Get all workouts");
});

router.post("/login", authController.mobilelogin);
router.post("/weblogin", authController.login);
router.post("/userregistration", authController.mobileuserregister);
router.post("/getBasicDetails", authController.getBasicDetails);

module.exports = router;
