const { mongoose, version } = require("mongoose");

const selfhelpgroupSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    groupname: {
      type: String,
    },   
    name: {
      type: String,
      required: true,
    },   
    father_name: {
      type: String,
    },   
    age: {
      type: Number,
    },   
    mobile: {
      type: String,
    },   
    casteid: {
      type: Number,
      default: 0,
    },   
    remark: {
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

const Selfhelpgroup = mongoose.model("Selfhelpgroup", selfhelpgroupSchema);

module.exports = Selfhelpgroup;
