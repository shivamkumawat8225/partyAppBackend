const { mongoose, version } = require("mongoose");

const surveyboothvoterSchema = new mongoose.Schema(
  {
    surveyid: {
      type: Number,
      required: true,
    },
    //voter
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    name_en: {
      type: String,
    },
    name_hi: {
      type: String,
    },
    name_as: {
      type: String,
    },

    // rel: {
    //   type: String,
    // },
    // rel_name: {
    //   type: String,
    // },
    // rel_name_en: {
    //   type: String,
    // },
    // rel_name_hi: {
    //   type: String,
    // },
    // rel_name_as: {
    //   type: String,
    // },
    mobile: {
      type: String,
      // required: true,
    },

    image: {
      type: String,
    },


    stateid: {
      type: Number,
      default: 0,
    },
    loksabhaid: {
      type: Number,
      default: 0,
    },
    jilaid: {
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
    nikayid: {
      type: Number,
      default: 0,
    },
    wardid: {
      type: Number,
      default: 0,
    },
    outoftown: {
      type: Number,
      default: 0,
    },
    out_place: {
      type: String,
      default: "",
    },
    out_distanse: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "0",
    },
    entrydatetime: {
      type: Date,
    },
  },
  { versionKey: false }
);

const Surveyboothvoter = mongoose.model("Surveyboothvoter", surveyboothvoterSchema);

module.exports = Surveyboothvoter;
