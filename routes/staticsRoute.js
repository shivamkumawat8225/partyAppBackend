const express = require("express");
const router = express.Router();
const staticsController = require("../controllers/staticsController");
const casteController = require("../controllers/casteController");
const AnalysisController = require("../controllers/AnaliysisController");
router.get("/", (req, res) => {
  res.send("Get all workouts");
});

router.post("/all", staticsController.all);
router.post("/questions", staticsController.allquestion);
router.post("/castes", staticsController.castes);
router.post("/addcastes", casteController.addCaste);
router.post("/levelList", staticsController.levelList);
router.post("/levelLists", staticsController.levelList);
router.post("/analysisbylevel", AnalysisController.levelList);

module.exports = router;
