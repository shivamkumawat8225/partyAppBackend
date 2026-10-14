const { mongoose } = require("mongoose");

const problemtypeSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
  },
  type_en: {
    type: String,
    required: true,
  },
  type_hi: {
    type: String,
    required: true,
  },
  type_kn: {
    type: String,
    required: true,
  },
  type_mr: {
    type: String,
    required: true,
  },
  type_gu: {
    type: String,
    required: true,
  },
  type_ml: {
    type: String,
    required: true,
  },
  type_pu: {
    type: String,
    required: true,
  },
  type_bn: {
    type: String,
    required: true,
  },
  type_te: {
    type: String,
    required: true,
  },
  type_ta: {
    type: String,
    required: true,
  },
  type_or: {
    type: String,
    required: true,
  },
  type_lus: {
    type: String,
    required: true,
  },
  type_as: {
    type: String,
    required: true,
  },
  type_doi: {
    type: String,
    required: true,
  },

});

const problemtype = mongoose.model("Problemtype", problemtypeSchema);

module.exports = problemtype;
