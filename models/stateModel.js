const { mongoose } = require("mongoose");

const stateSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
  },
  state_en: {
    type: String,
    required: true,
  },
  state_hi: {
    type: String,
    required: true,
  },
  state_kn: {
    type: String,
    required: true,
  },
  state_mr: {
    type: String,
    required: true,
  },
  state_gu: {
    type: String,
    required: true,
  },
  state_ml: {
    type: String,
    required: true,
  },
  state_pu: {
    type: String,
    required: true,
  },
  state_bn: {
    type: String,
    required: true,
  },
  state_te: {
    type: String,
    required: true,
  },
  state_ta: {
    type: String,
    required: true,
  },
  state_or: {
    type: String,
    required: true,
  },
  state_lus: {
    type: String,
    required: true,
  },
  state_as: {
    type: String,
    required: true,
  },
  state_doi: {
    type: String,
    required: true,
  },
});

const State = mongoose.model("State", stateSchema);

module.exports = State;
