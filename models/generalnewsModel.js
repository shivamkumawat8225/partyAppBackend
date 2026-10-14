const { mongoose, version } = require("mongoose");

const generalnewsSchema = new mongoose.Schema(
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
    //approved by level
    step1_approved: {
      type: Number,
      default: 0,
    },
    step1_comment: {
      type: String,
      default: "",
    },
    step1_approved_by: {
      type: String,
    },
    step1_apv_date: {
      type: Date,
    },
    step2_approved: {
      type: Number,
      default: 0,
    },
    step2_comment: {
      type: String,
      default: "",
    },
    step2_approved_by: {
      type: String,
    },
    step2_apv_date: {
      type: Date,
    },
    step3_approved: {
      type: Number,
      default: 0,
    },
    step3_comment: {
      type: String,
      default: "",
    },
    step3_approved_by: {
      type: String,
    },
    step3_apv_date: {
      type: Date,
    },
    step4_approved: {
      type: Number,
      default: 0,
    },
    step4_comment: {
      type: String,
      default: "",
    },
    step4_approved_by: {
      type: String,
    },
    step4_apv_date: {
      type: Date,
    },

    step5_approved: {
      type: Number,
      default: 0,
    },
    step5_comment: {
      type: String,
      default: "",
    },
    step5_approved_by: {
      type: String,
    },
    step5_apv_date: {
      type: Date,
    },

    step6_approved: {
      type: Number,
      default: 0,
    },
    step6_comment: {
      type: String,
      default: "",
    },
    step6_approved_by: {
      type: String,
    },
    step6_apv_date: {
      type: Date,
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

const Generalnews = mongoose.model("Generalnews", generalnewsSchema);

module.exports = Generalnews;
