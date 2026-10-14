const { mongoose } = require("mongoose");

const genderSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
  },
  gender_en: {
    type: String,
    required: true,
  },
  gender_hi: {
    type: String,
    required: true,
  },
  gender_kn: {
    type: String,
    required: true,
  },
  gender_mr: {
    type: String,
    required: true,
  },
  gender_gu: {
    type: String,
    required: true,
  },
  gender_ml: {
    type: String,
    required: true,
  },
  gender_pu: {
    type: String,
    required: true,
  },
  gender_bn: {
    type: String,
    required: true,
  },
  gender_te: {
    type: String,
    required: true,
  },
  gender_ta: {
    type: String,
    required: true,
  },
  gender_or: {
    type: String,
    required: true,
  },
  gender_lus: {
    type: String,
    required: true,
  },
  gender_as: {
    type: String,
    required: true,
  },
  gender_doi: {
    type: String,
    required: true,
  },
});

const Gender = mongoose.model("Gender", genderSchema);

module.exports = Gender;
