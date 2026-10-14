const express = require("express");
const router = express.Router();
const TaskReportController = require("../../../controllers/v2/reports/TaskreportsController");

router.post("/", TaskReportController.taskfeedwise);
router.post("/userdetails", TaskReportController.taskuserwise);

module.exports = router;
