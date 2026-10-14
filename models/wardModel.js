const { mongoose } = require("mongoose");
//ward / village collaction
const wardSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
  },
  //ward_type 1: वार्ड /2: ग्राम पंचायत
  ward_type: {
    type: Number,
    required: true,
    default: 1,
  },
  ward_kramank: {
    type: Number,
    required: true,
  },
  stateid: {
    type: Number,
    required: true,
  },
  jila_id: {
    type: Number,
    required: true,
  },
  nikay_id: {
    type: Number,
    required: true,
  },
  ward_en: {
    type: String,
    required: true,
  },
  ward_hi: {
    type: String,
    required: true,
  },
  ward_kn: {
    type: String,
    required: true,
  },
  ward_mr: {
    type: String,
    required: true,
  },
  ward_gu: {
    type: String,
    required: true,
  },
  ward_ml: {
    type: String,
    required: true,
  },
  ward_pu: {
    type: String,
    required: true,
  },
  ward_bn: {
    type: String,
    required: true,
  },
  ward_te: {
    type: String,
    required: true,
  },
  ward_ta: {
    type: String,
    required: true,
  },
  ward_or: {
    type: String,
    required: true,
  },
  ward_lus: {
    type: String,
    required: true,
  },
  ward_as: {
    type: String,
    required: true,
  },
  // dongri/
  ward_doi: {
    type: String,
    required: true,
  },
});

const Ward = mongoose.model("Ward", wardSchema);

module.exports = Ward;
