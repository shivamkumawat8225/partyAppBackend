const { mongoose } = require("mongoose");

const blockSchema = new mongoose.Schema({
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
  block_en: {
    type: String,
    required: true,
  },
  block_hi: {
    type: String,
    required: true,
  },
  block_kn: {
    type: String,
    required: true,
  },
  block_mr: {
    type: String,
    required: true,
  },
  block_gu: {
    type: String,
    required: true,
  },
  block_ml: {
    type: String,
    required: true,
  },
  block_pu: {
    type: String,
    required: true,
  },
  block_bn: {
    type: String,
    required: true,
  },
  block_te: {
    type: String,
    required: true,
  },
  block_ta: {
    type: String,
    required: true,
  },
  block_or: {
    type: String,
    required: true,
  },
  block_lus: {
    type: String,
    required: true,
  },
  block_as: {
    type: String,
    required: true,
  },
  block_doi: {
    type: String,
    required: true,
  },
});

const Block = mongoose.model("Block", blockSchema);

module.exports = Block;
