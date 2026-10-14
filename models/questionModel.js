const { mongoose } = require("mongoose");

const questionSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
  },
  question_en: {
    type: String,
    required: true,
  },
  question_hi: {
    type: String,
    required: true,
  },
  question_kn: {
    type: String,
    required: true,
  },
  question_mr: {
    type: String,
    required: true,
  },
  question_gu: {
    type: String,
    required: true,
  },
  question_ml: {
    type: String,
    required: true,
  },
  question_pu: {
    type: String,
    required: true,
  },
  question_bn: {
    type: String,
    required: true,
  },
  question_te: {
    type: String,
    required: true,
  },
  question_ta: {
    type: String,
    required: true,
  },
  question_or: {
    type: String,
    required: true,
  },
  question_lus: {
    type: String,
    required: true,
  },
  question_as: {
    type: String,
    required: true,
  },
  q_type: {
    type: String,
    required: true,
  },
});

const Question = mongoose.model("question", questionSchema);

module.exports = Question;
