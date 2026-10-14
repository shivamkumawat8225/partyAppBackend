const { mongoose } = require("mongoose");

const jilaSchema = new mongoose.Schema({
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
  jila_en: {
    type: Number,
    required: true,
  },
  jila_hi: {
    type: String,
    required: true,
  },
  jila_kn: {
    type: String,
    required: true,
  },
  jila_mr: {
    type: String,
    required: true,
  },
  jila_gu: {
    type: String,
    required: true,
  },
  jila_ml: {
    type: String,
    required: true,
  },
  jila_pu: {
    type: String,
    required: true,
  },
  jila_bn: {
    type: String,
    required: true,
  },
  jila_te: {
    type: String,
    required: true,
  },
  jila_ta: {
    type: String,
    required: true,
  },
  jila_or: {
    type: String,
    required: true,
  },
  jila_lus: {
    type: String,
    required: true,
  },
  jila_as: {
    type: String,
    required: true,
  },
  jila_doi: {
    type: String,
    required: true,
  },
});

const Jila = mongoose.model("Jila", jilaSchema);

module.exports = Jila;
