const { mongoose } = require("mongoose");

const educationSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
  },
  education_en: {
    type: String,
    required: true,
  },
  education_hi: {
    type: String,
    required: true,
  },
  education_kn: {
    type: String,
    required: true,
  },
  education_mr: {
    type: String,
    required: true,
  },
  education_gu: {
    type: String,
    required: true,
  },
  education_ml: {
    type: String,
    required: true,
  },
  education_pu: {
    type: String,
    required: true,
  },
  education_bn: {
    type: String,
    required: true,
  },
  education_te: {
    type: String,
    required: true,
  },
  education_ta: {
    type: String,
    required: true,
  },
  education_or: {
    type: String,
    required: true,
  },
  education_lus: {
    type: String,
    required: true,
  },
  education_as: {
    type: String,
    required: true,
  },
  education_doi: {
    type: String,
    required: true,
  },
});

const Education = mongoose.model("Education", educationSchema);

module.exports = Education;
