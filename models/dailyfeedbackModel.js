const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var dailyfeedbackSchema = new mongoose.Schema(
  {
    createrId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },

    feedback: {
      type: String,
      default: "",
    },
    teamId: {
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
module.exports = mongoose.model("Dailyfeedback", dailyfeedbackSchema);
