const express = require("express");
const router = express.Router();
const staticController = require("../../../controllers/v2/staticsController");
const userController = require("../../../controllers/v2/usersController");
const FamilysurveyController = require("../../../controllers/v2/reports/FamilysurveyController");
const FamilysurveyControllers = require("../../../controllers/v2/reports/web/FamilysurveyController");
const TaskReportController = require("../../../controllers/v2/reports/TaskreportsController");

router.get("/", (req, res) => {
  res.send("Get all workouts");
});

router.post("/religion", FamilysurveyController.religionwise);
router.post("/category", FamilysurveyController.categorywise);
router.post("/caste", FamilysurveyController.castewise);
router.post("/total_new_voter", FamilysurveyController.total_new_voter);
router.post("/total_out_of_town", FamilysurveyController.total_out_of_voter);
router.post("/total_dead_voter", FamilysurveyController.total_dead_voter);
router.post("/total_voters", FamilysurveyController.total_voters_count);
router.post("/card_wise_report", FamilysurveyController.card_wise_report);
router.post(
  "/economics_condition",
  FamilysurveyController.economics_condition_report
);
router.post("/vehicals", FamilysurveyController.vehicals_wise_report);
// router.post("/voter", FamilysurveyController.educationwise);


router.post("/web/religion", FamilysurveyControllers.religionwise);
router.post("/web/category", FamilysurveyControllers.categorywise);
router.post("/web/caste", FamilysurveyControllers.castewise);
router.post("/web/total_new_voter", FamilysurveyControllers.total_new_voter);
router.post("/web/total_out_of_town", FamilysurveyControllers.total_out_of_voter);
router.post("/web/total_dead_voter", FamilysurveyControllers.total_dead_voter);
router.post("/web/total_voters", FamilysurveyControllers.total_voters_count);
router.post("/web/card_wise_report", FamilysurveyControllers.card_wise_report);
router.post(
  "/economics_condition",
  FamilysurveyControllers.economics_condition_report
);
router.post("/web/vehicals", FamilysurveyControllers.vehicals_wise_report);
// router.post("/voter", FamilysurveyController.educationwise);

module.exports = router;
