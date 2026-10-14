const express = require("express");
const router = express.Router();
const staticController = require("../../controllers/v2/staticsController");
const userController = require("../../controllers/v2/usersController");

router.get("/", (req, res) => {
  res.send("Get all workouts");
});

router.post("/", userController.users);
router.post("/warroomusers", userController.warroomusers);
router.post("/lowerwarroomusers", userController.lowerwarroomusers);
router.post("/lowermonitoringusers", userController.lowermonitoringusers);
router.post("/monitoringusers", userController.monitoringusers);
router.post("/managmentusers", userController.managmentusers);
router.post("/userStatusChangner", userController.statusChnager);
router.post("/userProfile", userController.userprofile);
router.post("/mastertrainer", userController.masterttrainer_by_vidhansbha);
module.exports = router;
