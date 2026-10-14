const { mongoose, version } = require("mongoose");

const pracharkmemberSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    address: { type: String },
    assigned_groups: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pracharkgroup'
    }],
    boothid: { type: Number, default: null },
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

const Pracharkmember = mongoose.model("Pracharkmember", pracharkmemberSchema);

module.exports = Pracharkmember;
