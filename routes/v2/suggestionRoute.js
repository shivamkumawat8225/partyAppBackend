const express = require("express");
const router = express.Router();
const SuggestionController = require("../../controllers/v2/SuggestionController");

router.get("/", (req, res) => {
  res.send("Get all workouts");
});

// router.post("/", userController.users);
router.post("/add", SuggestionController.addsuggestion);
router.post("/getsuggestion", SuggestionController.getsuggestion);
router.post("/approving", SuggestionController.approving);
module.exports = router;
//suggestion
