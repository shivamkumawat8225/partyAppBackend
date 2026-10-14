const express = require("express");
const router = express.Router();
const { logins, signup } = require("../controllers/authController");

router.get("/", (req, res) => {
  res.send("Get all workouts");
});

router.post("/signup", signup);
router.post("/login", logins);
// router.post("/login", authController.login);

module.exports = router;
