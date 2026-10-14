const express = require("express");
const router = express.Router();
const surveyController = require("../controllers/surveyController");
const userController = require("../controllers/usersController");

router.get("/", (req, res) => {
  res.send("Get all workouts");
});

// router.post("/", userController.users);
router.post("/addfamilysurvey", surveyController.addfamilysurvey);
router.post("/getfamilysurvey", surveyController.getfamilysurvey);
// router.post("/lowerwarroomusers", userController.lowerwarroomusers);
// router.post("/lowermonitoringusers", userController.lowermonitoringusers);
// router.post("/monitoringusers", userController.monitoringusers);
// router.post("/userStatusChangner", userController.statusChnager);

module.exports = router;
