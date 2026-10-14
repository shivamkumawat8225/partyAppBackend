const express = require("express");
const router = express.Router();
const staticsController = require("../../controllers/v2/staticsController");
const casteController = require("../../controllers/v2/casteController");
const AnalysisController = require("../../controllers/v2/AnaliysisController");
router.get("/", (req, res) => {
  res.send("Get all workouts");
});

router.post("/all", staticsController.all);
router.post("/postlist", staticsController.postlist);
router.post("/boothlist", staticsController.boothlist);
router.post("/questions", staticsController.allquestion);
router.post("/boothquestions", staticsController.boothquestions);
router.post("/castes", staticsController.castes);
router.post("/addcastes", casteController.addCaste);
router.post("/levelList", staticsController.levelList);
router.post("/levelLists", staticsController.levelLists);
router.post("/analysisbylevel", AnalysisController.levelList);
//new 8/9/2026
router.post("/vidhansabhalistwithpaggination", staticsController.vidhansabhalistwithpagginations);
router.post("/blocklistwithpaggination", staticsController.blocklistwithpagginations);
router.post("/zonelistwithpaggination", staticsController.zonelistwithpagginations);
router.post("/sectorlistwithpaggination", staticsController.sectorlistwithpagginations);
router.post("/boothlistwithpaggination", staticsController.boothlistwithpagginations);

module.exports = router;
