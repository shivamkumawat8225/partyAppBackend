const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/v2/pracharkController");
const userController = require("../../controllers/v2/usersController");
// http://localhost:3001/api/v2/prachark/group
router.get("/", (req, res) => {
  res.send("Get all workouts");
});
  // router.post("/", userController.users);
router.post("/groups", Controller.createGroup);
router.post("/members", Controller.upsertMemberWithGroups);
router.get("/members", Controller.getAllMembers);
router.get("/groups", Controller.getAllGroups);


module.exports = router;
