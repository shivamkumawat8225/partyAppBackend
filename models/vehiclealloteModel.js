const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var vehiclealloteSchema = new mongoose.Schema(
  {
    createrId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    vehicleId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },

    updateuserId: {
      type: mongoose.Schema.ObjectId,
    },
    return: {
      type: Boolean,
      default: false,
    },

    allotedate: {
      type: Date,
    },
    returndate: {
      type: Date,
    },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Vehicleallote", vehiclealloteSchema);
