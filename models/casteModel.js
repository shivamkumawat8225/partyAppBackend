const { mongoose } = require("mongoose");

const casteSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
    index: true
  },
  categoryid: {
    type: Number,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
  },
  stateid: {
    type: Number,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
  },
  caste_en: {
    type: String,
    required: true,
  },
  caste_hi: {
    type: String,
    required: true,
  },
  caste_kn: {
    type: String,
    required: true,
  },
  caste_mr: {
    type: String,
    required: true,
  },
  caste_gu: {
    type: String,
    required: true,
  },
  caste_ml: {
    type: String,
    required: true,
  },
  caste_pu: {
    type: String,
    required: true,
  },
  caste_bn: {
    type: String,
    required: true,
  },
  caste_te: {
    type: String,
    required: true,
  },
  caste_ta: {
    type: String,
    required: true,
  },
  caste_or: {
    type: String,
    required: true,
  },
  caste_lus: {
    type: String,
    required: true,
  },
  caste_as: {
    type: String,
    required: true,
  },
  caste_doi: {
    type: String,
    required: true,
  },
});

const Caste = mongoose.model("Caste", casteSchema);

module.exports = Caste;
