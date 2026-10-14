const express = require("express");
const router = express.Router();
const { livevotingdata, livevoting, viewElectionDayLiveBoothDetail, updateVote, changeBoothDetailById, boothdata } = require("../../controllers/v2/reports/ElectiondayController");

// File Upload Endpoint

router.get("/", (req, res) => {
  res.send("Get all workouts");
});

router.post("/data", livevotingdata);
router.post("/boothdata", boothdata);
router.post("/vote", livevoting);
router.post("/updateVote", updateVote);
router.post("/viewElectionDay", viewElectionDayLiveBoothDetail);
router.post("/changeBoothDetailById", changeBoothDetailById);

module.exports = router;
