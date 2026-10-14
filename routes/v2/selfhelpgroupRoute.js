const express = require("express");
const router = express.Router();
const surveyController = require("../../controllers/v2/surveyselfhelpgroupController");
const userController = require("../../controllers/v2/usersController");
// http://localhost:3001/api/v2/selfhelpgroup/addselfhelpgroup
router.get("/", (req, res) => {
  res.send("Get all workouts");
});
  // router.post("/", userController.users);
router.post("/add", surveyController.addselfhelpgroup);
router.post("/get", surveyController.getselfhelpgroup);

module.exports = router;
