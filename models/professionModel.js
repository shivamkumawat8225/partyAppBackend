const { mongoose } = require("mongoose");

const professionSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
  },
  profession_en: {
    type: String,
    required: true,
  },
  profession_hi: {
    type: String,
    required: true,
  },
  profession_kn: {
    type: String,
    required: true,
  },
  profession_mr: {
    type: String,
    required: true,
  },
  profession_gu: {
    type: String,
    required: true,
  },
  profession_ml: {
    type: String,
    required: true,
  },
  profession_pu: {
    type: String,
    required: true,
  },
  profession_bn: {
    type: String,
    required: true,
  },
  profession_te: {
    type: String,
    required: true,
  },
  profession_ta: {
    type: String,
    required: true,
  },
  profession_or: {
    type: String,
    required: true,
  },
  profession_lus: {
    type: String,
    required: true,
  },
  profession_as: {
    type: String,
    required: true,
  },
  profession_doi: {
    type: String,
    required: true,
  },
});

const Profession = mongoose.model("Profession", professionSchema);

module.exports = Profession;
