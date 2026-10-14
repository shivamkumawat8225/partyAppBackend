const express = require("express");
const router = express.Router();
const UsersController = require("../../../controllers/v2/managmentteam/UsersController");
const VehicleController = require("../../../controllers/v2/managmentteam/VehiclesController");
const FeedbackController = require("../../../controllers/v2/managmentteam/FeedbackController");
router.get("/", (req, res) => {
  res.send("Get all workouts");
});

router.post("/usersbypost", UsersController.usersbypost);
router.post("/multyroleusers", UsersController.multyroleusers);
router.post("/usersbylevel", UsersController.usersbylevel);
router.post(
  "/boothlistwithfamilycounts",
  UsersController.boothlistwithfamilycounts
);
router.post("/addvehicle", VehicleController.addvehiclesurvey);
router.post("/vehiclelist", VehicleController.getAllVehiclesWithOwner);
router.post("/addfeedback", FeedbackController.addfeedback);
router.post("/addNagativeKhabar", FeedbackController.addNagativeKhabar);
router.post("/nagetiveKhabarList", FeedbackController.nagetiveKhabarList);
router.post("/getfeedback", FeedbackController.getFeedbacklist);

router.post("/adddailyfeedback", FeedbackController.adddailyfeedback);
router.post("/getdailyfeedback", FeedbackController.getDailyFeedbacklist);

router.post("/allvehicles", VehicleController.getAllVehiclesWithSearch);
router.post("/vehicleallotment", VehicleController.vehicleallotment);
router.post("/vehicleallotmentlist", VehicleController.vehicleallotmentlist);
router.post(
  "/updateallotmentstatus",
  VehicleController.updateVehicleAllomentStatus
);

module.exports = router;
