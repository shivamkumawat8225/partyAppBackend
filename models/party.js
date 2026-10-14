const { mongoose } = require("mongoose");

const partySchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
  },
  party_en: {
    type: String,
    required: true,
  },
  party_hi: {
    type: String,
    required: true,
  },
  party_kn: {
    type: String,
    required: true,
  },
  party_mr: {
    type: String,
    required: true,
  },
  party_gu: {
    type: String,
    required: true,
  },
  party_ml: {
    type: String,
    required: true,
  },
  party_pu: {
    type: String,
    required: true,
  },
  party_bn: {
    type: String,
    required: true,
  },
  party_te: {
    type: String,
    required: true,
  },
  party_ta: {
    type: String,
    required: true,
  },
  party_or: {
    type: String,
    required: true,
  },
  party_lus: {
    type: String,
    required: true,
  },
  party_as: {
    type: String,
    required: true,
  },
  party_doi: {
    type: String,
    required: true,
  },
});

const Party = mongoose.model("Party", partySchema);

module.exports = Party;
