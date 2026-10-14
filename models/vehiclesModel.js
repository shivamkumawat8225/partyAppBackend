const { mongoose, version } = require("mongoose");
const bcrypt = require("bcryptjs");

const vehiclesSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vehicleowners",
      required: true,
    },
    drivername: {
      type: String,
      required: true,
    },
    license_no: {
      type: String,
      default: "",
    },
    mobile: {
      type: String,
      required: true,
    },
    aadhar_no: {
      type: String,
      default: "",
    },
    vehicle_name: {
      type: String,
      default: "",
    },
    vehicle_number: {
      type: String,
      default: "",
    },
    vehicle_color: {
      type: String,
      default: "",
    },
    model: {
      type: String,
      default: "",
    },
    allote: {
      type: Number,
      default: 0,
    },
    vehicles_images: [
      {
        type: String,
        default: "",
      },
    ],
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

const Vehicles = mongoose.model("Vehicles", vehiclesSchema);

module.exports = Vehicles;
