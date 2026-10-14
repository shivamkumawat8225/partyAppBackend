const express = require("express");
const router = express.Router();
const usersreportController = require("../../../controllers/v2/reports/UsersreportsController");

router.get("/", (req, res) => {
  res.send("Get all workouts");
});

router.post("/counts", usersreportController.contswise);
router.post("/details", usersreportController.detailswise);
router.post("/rating", usersreportController.boothrating);

module.exports = router;
