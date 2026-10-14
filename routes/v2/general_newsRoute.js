const express = require("express");
const router = express.Router();
const generalnewsController = require("../../controllers/v2/generalnewsController");

router.get("/", (req, res) => {
  res.send("Get all workouts");
});

// router.post("/", userController.users);
router.post("/add", generalnewsController.addnews);
router.post("/getnews", generalnewsController.getnews);
router.post("/approving", generalnewsController.approving);
router.post("/test", generalnewsController.testing);
module.exports = router;
//suggestion
