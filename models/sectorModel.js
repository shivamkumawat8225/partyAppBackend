const { mongoose } = require("mongoose");

const sectorSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
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
  sector_en: {
    type: String,
    required: true,
  },
  sector_hi: {
    type: String,
    required: true,
  },
  sector_kn: {
    type: String,
    required: true,
  },
  sector_mr: {
    type: String,
    required: true,
  },
  sector_gu: {
    type: String,
    required: true,
  },
  sector_ml: {
    type: String,
    required: true,
  },
  sector_pu: {
    type: String,
    required: true,
  },
  sector_bn: {
    type: String,
    required: true,
  },
  sector_te: {
    type: String,
    required: true,
  },
  sector_ta: {
    type: String,
    required: true,
  },
  sector_or: {
    type: String,
    required: true,
  },
  sector_lus: {
    type: String,
    required: true,
  },
  sector_as: {
    type: String,
    required: true,
  },
  sector_doi: {
    type: String,
    required: true,
  },
});

const Sector = mongoose.model("Sector", sectorSchema);

module.exports = Sector;
