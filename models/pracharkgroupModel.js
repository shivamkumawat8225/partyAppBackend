const { mongoose, version } = require("mongoose");

const pracharkgroupSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: { type: String, trim: true },
    type: { type: String, enum: ['rally', 'toli'], required: true },
    vehicle_type: { type: String, default: null }, // motorcycle, bicycle
    voter_range_from: { type: Number, default: null },
    voter_range_to: { type: Number, default: null },
    boothid: { type: Number, default: null },
    sectorid: { type: Number, default: null },
    zoneid: { type: Number, default: null },
    blockid: { type: Number, default: null },
    vidhansabhaid: { type: Number, default: null },
    jilaid: { type: Number, default: null },
    loksabhaid: { type: Number, default: null },
    stateid: { type: Number, default: null },
  },
  { versionKey: false }
);

const Pracharkgroup = mongoose.model("Pracharkgroup", pracharkgroupSchema);

module.exports = Pracharkgroup;
