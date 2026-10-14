const { mongoose } = require("mongoose");

const religionSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
  },
  religion_en: {
    type: String,
    required: true,
  },
  religion_hi: {
    type: String,
    required: true,
  },
  religion_kn: {
    type: String,
    required: true,
  },
  religion_mr: {
    type: String,
    required: true,
  },
  religion_gu: {
    type: String,
    required: true,
  },
  religion_ml: {
    type: String,
    required: true,
  },
  religion_pu: {
    type: String,
    required: true,
  },
  religion_bn: {
    type: String,
    required: true,
  },
  religion_te: {
    type: String,
    required: true,
  },
  religion_ta: {
    type: String,
    required: true,
  },
  religion_or: {
    type: String,
    required: true,
  },
  religion_lus: {
    type: String,
    required: true,
  },
  religion_as: {
    type: String,
    required: true,
  },
  religion_doi: {
    type: String,
    required: true,
  },
});

const Religion = mongoose.model("Religion", religionSchema);

module.exports = Religion;
