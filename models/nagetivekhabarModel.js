const mongoose = require("mongoose"); // Erase if already required
// Declare the Schema of the Mongo model
var nagetivekhabarSchema = new mongoose.Schema(
  {
    createrId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },
    status: {
      type: Boolean,
      default: false,
    },
    stateid: {
      type: Number,
      default: 0,
    },
    loksabhaid: {
      type: Number,
      default: 0,
    },
    vidhansabhaid: {
      type: Number,
      default: 0,
    },
    blockid: {
      type: Number,
      default: 0,
    },
    zoneid: {
      type: Number,
      default: 0,
    },
    sectorid: {
      type: Number,
      default: 0,
    },
    boothid: {
      type: Number,
      default: 0,
    },
    jilaid: {
      type: Number,
      default: 0,
    },
    nikayid: {
      type: Number,
      default: 0,
    },
    wardid: {
      type: Number,
      default: 0,
    },
    entrydatetime: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
//Export the model
module.exports = mongoose.model("Nagetivekhabar", nagetivekhabarSchema);
// nagetivekhabarModel.js
// This file defines a Mongoose schema and model for a "Nagetivekhabar" collection in MongoDB.
// The schema includes fields for various identifiers, a description, a status flag, and timestamps.
