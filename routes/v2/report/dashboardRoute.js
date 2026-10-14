const express = require("express");
const router = express.Router();
const DashboardController = require("../../../controllers/v2/reports/DashboardController");
const { authenticateToken } = require("../../../middilware/authMiddleware");

router.get("/", (req, res) => {
  res.send("Get all workouts");
});

router.post("/count", authenticateToken, DashboardController.countswise);

module.exports = router;
