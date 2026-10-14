const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/v2/castestaticsController");
// http://localhost:3001/api/v2/castestatic/
router.get("/", (req, res) => {
  res.send("Get all workouts");
});
  // router.post("/", userController.users);
router.post("/", Controller.saveMultipleCastes);
router.get("/booth/:boothid", Controller.getCastesByBoothId);
router.delete("/remove", Controller.removeCasteStatistic);

module.exports = router;
