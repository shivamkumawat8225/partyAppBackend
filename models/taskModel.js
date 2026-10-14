const { mongoose, version } = require("mongoose");

const taskSchema = new mongoose.Schema(
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
    title: {
      type: String,
    },
    desc: {
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
    boothid: {
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

    nikayid: {
      type: [Number],
      default: [],
    },

    wardid: {
      type: [Number],
      default: [],
    },
    role: {
      type: Number,
    },
    no_of_feed: {
      type: Number,
      default: 0,
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

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
