const { mongoose } = require("mongoose");

const loksabhaSchema = new mongoose.Schema({
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
  loksabha_en: {
    type: String,
    required: true,
  },
  loksabha_hi: {
    type: String,
    required: true,
  },
  loksabha_kn: {
    type: String,
    required: true,
  },
  loksabha_mr: {
    type: String,
    required: true,
  },
  loksabha_gu: {
    type: String,
    required: true,
  },
  loksabha_ml: {
    type: String,
    required: true,
  },
  loksabha_pu: {
    type: String,
    required: true,
  },
  loksabha_bn: {
    type: String,
    required: true,
  },
  loksabha_te: {
    type: String,
    required: true,
  },
  loksabha_ta: {
    type: String,
    required: true,
  },
  loksabha_or: {
    type: String,
    required: true,
  },
  loksabha_lus: {
    type: String,
    required: true,
  },
  loksabha_as: {
    type: String,
    required: true,
  },
  loksabha_doi: {
    type: String,
    required: true,
  },
});

const Loksabha = mongoose.model("Loksabha", loksabhaSchema);

module.exports = Loksabha;
