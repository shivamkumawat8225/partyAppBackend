const express = require("express");
const router = express.Router();
const staticController = require("../controllers/staticsController");
const userController = require("../controllers/usersController");

router.get("/", (req, res) => {
  res.send("Get all workouts");
});

router.post("/", userController.users);
router.post("/warroomusers", userController.warroomusers);
router.post("/lowerwarroomusers", userController.lowerwarroomusers);
router.post("/lowermonitoringusers", userController.lowermonitoringusers);
router.post("/monitoringusers", userController.monitoringusers);
router.post("/userStatusChangner", userController.statusChnager);

module.exports = router;
