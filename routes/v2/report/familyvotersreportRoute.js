const express = require("express");
const router = express.Router();
const votersurveyController = require("../../../controllers/v2/reports/FamilyvotersurveyController");
const webvotersurveyController = require("../../../controllers/v2/reports/web/FamilyvotersurveyController");

router.get("/", (req, res) => {
  res.send("Get all workouts");
});

router.post("/educations", votersurveyController.educationwise);
router.post("/professions", votersurveyController.professionwise);
router.post("/partys", votersurveyController.partywise);
router.post("/genders", votersurveyController.genderywise);
router.post("/allwhatsapp", votersurveyController.allwhatsapp);
router.post("/educationstatus", votersurveyController.educationstatus);
router.post("/age", votersurveyController.agewise);
router.post("/disablevoter", votersurveyController.disablevoter);
router.post("/caste_dominant", votersurveyController.caste_dominant);
router.post("/head_of_religion", votersurveyController.head_of_religion);
router.post("/first_time_voter", votersurveyController.first_time_voter);
router.post("/booth_speaker", votersurveyController.booth_speaker);
router.post("/support_worker", votersurveyController.support_worker);
router.post(
  "/opposite_party_worker",
  votersurveyController.opposite_party_worker
);

router.post("/web/educations", webvotersurveyController.educationwise);
router.post("/web/professions", webvotersurveyController.professionwise);
router.post("/web/partys", webvotersurveyController.partywise);
router.post("/web/genders", webvotersurveyController.genderywise);
router.post("/web/allwhatsapp", webvotersurveyController.allwhatsapp);
router.post("/web/educationstatus", webvotersurveyController.educationstatus);
router.post("/web/age", webvotersurveyController.agewise);
router.post("/web/disablevoter", webvotersurveyController.disablevoter);
router.post("/web/caste_dominant", webvotersurveyController.caste_dominant);
router.post("/web/head_of_religion", webvotersurveyController.head_of_religion);
router.post("/web/first_time_voter", webvotersurveyController.first_time_voter);
router.post("/web/booth_speaker", webvotersurveyController.booth_speaker);
router.post("/web/support_worker", webvotersurveyController.support_worker);
router.post(
  "/web/opposite_party_worker",
  webvotersurveyController.opposite_party_worker
);

module.exports = router;
