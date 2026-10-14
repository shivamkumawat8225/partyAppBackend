const { mongoose, version } = require("mongoose");

const taskfeedbackSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value",
      },
    },
    userId: {
      type: String,
      required: true,
    },
    taskId: {
      type: String,
      required: true,
    },
    feedback: {
      type: String,
    },

    attechment_type: {
      type: String,
    },
    attechment_link: {
      type: String,
    },
    stateid: {
      type: [Number],
      default: [],
    },
    loksabhaid: {
      type: [Number],
      default: [],
    },
    jilaid: {
      type: [Number],
      default: [],
    },
    vidhansabhaid: {
      type: [Number],
      default: [],
    },
    blockid: {
      type: [Number],
      default: [],
    },
    zoneid: {
      type: [Number],
      default: [],
    },
    sectorid: {
      type: [Number],
      default: [],
    },
    boothid: {
      type: [Number],
      default: [],
    },

    nikayid: {
      type: [Number],
      default: [],
    },

    wardid: {
      type: [Number],
      default: [],
    },

    lat: {
      type: String,
      default: "",
    },
    long: {
      type: String,
      default: "",
    },
    status: {
      type: Number,
      default: 0,
    },
    entrydatetime: {
      type: Date,
    },
  },
  { versionKey: false }
);

const Taskfeedback = mongoose.model("Taskfeedback", taskfeedbackSchema);

module.exports = Taskfeedback;
