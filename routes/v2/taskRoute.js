const express = require("express");
const router = express.Router();
const taskController = require("../../controllers/v2/taskController");

router.get("/", (req, res) => {
  res.send("Get all workouts");
});

// router.post("/", userController.users);
router.post("/add", taskController.addtask);
router.post("/gettask", taskController.gettask);
router.post("/addtaskfeed", taskController.addtaskfeed);
module.exports = router;
