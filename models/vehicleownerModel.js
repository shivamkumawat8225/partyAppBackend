const { mongoose, version } = require("mongoose");
const bcrypt = require("bcryptjs");

const vehicleownerSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    ownername: {
      type: String,
      required: true,
    },
    aadhar_no: {
      type: String,
      default: "",
    },
    mobile: {
      type: String,
      required: true,
    },
    no_of_vehicles: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    entrydatetime: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: Number,
      default: 0,
    },
  },
  { versionKey: false }
);

const Vehicleowner = mongoose.model("Vehicleowner", vehicleownerSchema);

module.exports = Vehicleowner;
