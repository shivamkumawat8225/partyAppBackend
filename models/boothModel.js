const { mongoose } = require("mongoose");

const boothSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
  },
  booth_kramank: {
    type: Number,
    required: true,
  },
  stateid: {
    type: Number,
    required: true,
  },
  loksabha_id: {
    type: Number,
    required: true,
  },
  jila_id: {
    type: Number,
    required: true,
  },
  vidhansabha_id: {
    type: Number,
    required: true,
  },
  block_id: {
    type: Number,
    required: true,
  },
  zone_id: {
    type: Number,
    required: true,
  },
  sector_id: {
    type: Number,
    required: true,
  },
  booth_en: {
    type: String,
    required: true,
  },
  booth_hi: {
    type: String,
    required: true,
  },
  booth_kn: {
    type: String,
    required: true,
  },
  booth_mr: {
    type: String,
    required: true,
  },
  booth_gu: {
    type: String,
    required: true,
  },
  booth_ml: {
    type: String,
    required: true,
  },
  booth_pu: {
    type: String,
    required: true,
  },
  booth_bn: {
    type: String,
    required: true,
  },
  booth_te: {
    type: String,
    required: true,
  },
  booth_ta: {
    type: String,
    required: true,
  },
  booth_or: {
    type: String,
    required: true,
  },
  booth_lus: {
    type: String,
    required: true,
  },
  booth_as: {
    type: String,
    required: true,
  },
  // dongri/
  booth_doi: {
    type: String,
    required: true,
  },
});

const Booth = mongoose.model("Booth", boothSchema);

module.exports = Booth;
