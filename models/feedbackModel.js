const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var feedbackSchema = new mongoose.Schema(
  {
    createrId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    feedback: {
      type: String,
      default: "",
    },
    teamId: {
      type: Number,
    },
    roleId: {
      type: Number,
    },
    q1: {
      type: Number,
    },
    q2: {
      type: Number,
    },
    q3: {
      type: Number,
    },
    q4: {
      type: Number,
    },
    q5: {
      type: Number,
    },
    q6: {
      type: Number,
    },
    q7: {
      type: Number,
    },
    q8: {
      type: Number,
    },
    q9: {
      type: Number,
    },
    q10: {
      type: Number,
    },
    entrydatetime: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Feedback", feedbackSchema);
