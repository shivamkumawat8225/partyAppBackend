const express = require("express");
const router = express.Router();
const UsersController = require("../../../controllers/v2/managmentteam/UsersController");
router.get("/", (req, res) => {
  res.send("Get all workouts");
});

router.post("/usersbypost", UsersController.usersbypost);

module.exports = router;
