const { mongoose } = require("mongoose");

const vidhansabhaSchema = new mongoose.Schema({
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
  vidhansabha_en: {
    type: String,
    required: true,
  },
  vidhansabha_hi: {
    type: String,
    required: true,
  },
  vidhansabha_kn: {
    type: String,
    required: true,
  },
  vidhansabha_mr: {
    type: String,
    required: true,
  },
  vidhansabha_gu: {
    type: String,
    required: true,
  },
  vidhansabha_ml: {
    type: String,
    required: true,
  },
  vidhansabha_pu: {
    type: String,
    required: true,
  },
  vidhansabha_bn: {
    type: String,
    required: true,
  },
  vidhansabha_te: {
    type: String,
    required: true,
  },
  vidhansabha_ta: {
    type: String,
    required: true,
  },
  vidhansabha_or: {
    type: String,
    required: true,
  },
  vidhansabha_lus: {
    type: String,
    required: true,
  },
  vidhansabha_as: {
    type: String,
    required: true,
  },
  vidhansabha_doi: {
    type: String,
    required: true,
  },
});

const Vidhansabha = mongoose.model("Vidhansabha", vidhansabhaSchema);

module.exports = Vidhansabha;
