const { mongoose } = require("mongoose");

const zoneSchema = new mongoose.Schema({
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
  zone_en: {
    type: String,
    required: true,
  },
  zone_hi: {
    type: String,
    required: true,
  },
  zone_kn: {
    type: String,
    required: true,
  },
  zone_mr: {
    type: String,
    required: true,
  },
  zone_gu: {
    type: String,
    required: true,
  },
  zone_ml: {
    type: String,
    required: true,
  },
  zone_pu: {
    type: String,
    required: true,
  },
  zone_bn: {
    type: String,
    required: true,
  },
  zone_te: {
    type: String,
    required: true,
  },
  zone_ta: {
    type: String,
    required: true,
  },
  zone_or: {
    type: String,
    required: true,
  },
  zone_lus: {
    type: String,
    required: true,
  },
  zone_as: {
    type: String,
    required: true,
  },
  zone_doi: {
    type: String,
    required: true,
  },
});

const Zone = mongoose.model("Zone", zoneSchema);

module.exports = Zone;
