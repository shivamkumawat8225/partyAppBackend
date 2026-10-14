const express = require("express");
const router = express.Router();
const surveyController = require("../../controllers/v2/surveyController");
const userController = require("../../controllers/v2/usersController");
// http://localhost:3001/api/v2/survey/addboothsurvey
router.get("/", (req, res) => {
  res.send("Get all workouts");
});
// router.post("/", userController.users);
router.post("/addfamilysurvey", surveyController.addfamilysurvey);
router.post("/getfamilysurvey", surveyController.getfamilysurvey);
router.post("/addboothsurvey", surveyController.addboothsurvey);
router.post("/getboothsurvey", surveyController.getboothsurvey);
router.post("/getproblemsurvey", surveyController.getproblemsurvey);
router.post("/addproblemsurvey", surveyController.addproblesurvey);
router.post("/getproblemsurvey", surveyController.getproblemsurvey);
router.post("/addsurveysuggesion", surveyController.addsurveysuggesion);
router.post("/getsurveysuggesion", surveyController.getsurveysuggesion);
router.post("/approving", surveyController.approving);

module.exports = router;
