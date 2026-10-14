const express = require("express");
const router = express.Router();
const { activeusers, activeuserscount, activeuserslocation } = require("../../controllers/activeuserController");

// File Upload Endpoint

router.get("/", (req, res) => {
  res.send("Get all workouts");
});

router.post("/data", activeusers);
router.post("/count", activeuserscount);
router.post("/location", activeuserslocation);

module.exports = router;
