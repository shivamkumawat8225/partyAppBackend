const express = require("express");
const router = express.Router();
const { report, saveLocation } = require("../../controllers/v2/locationController");

// File Upload Endpoint

router.get("/", (req, res) => {
  res.send("Get all workouts");
});

router.post("/save", saveLocation);
router.get("/report/:userId", report);

module.exports = router;
