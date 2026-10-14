const express = require("express");
const router = express.Router();
const generalnewsController = require("../controllers/generalnewsController");

router.get("/", (req, res) => {
  res.send("Get all workouts");
});

// router.post("/", userController.users);
router.post("/add", generalnewsController.addnews);
module.exports = router;
