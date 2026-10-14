const { mongoose, version } = require("mongoose");

const castestaticsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },    
    casteId: {
      type: Number,
      required: true,
      index: true
    },    
    voterCount: {
      type: Number,
      default: 0,
    },
    boothid: { type: Number, default: null ,index: true},
    sectorid: { type: Number, default: null },
    zoneid: { type: Number, default: null },
    blockid: { type: Number, default: null },
    vidhansabhaid: { type: Number, default: null },
    jilaid: { type: Number, default: null },
    loksabhaid: { type: Number, default: null },
    stateid: { type: Number, default: null },
  },
  {
    versionKey: false,
    timestamps: true
  }
);

const Castestatics = mongoose.model("Castestatics", castestaticsSchema);

module.exports = Castestatics;
