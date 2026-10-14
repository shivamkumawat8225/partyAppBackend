const { mongoose } = require("mongoose");

const nikaySchema = new mongoose.Schema({
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
  jila_id: {
    type: Number,
    required: true,
  },

  nikay_kramnak: {
    type: Number,
    required: true,
  },
  // nikay_kramnak
  // निकाय के प्रकार ,1 :महानगर निगम,2: नगर निगम ,3:नगर पालिका,4: नगर परिषद, 5 :नगर पंचायत
  //  village:ग्रामीण : जिला पंचायत ,6:जनपद पंचायत

  nikay_type: {
    type: Number,
    required: true,
    default: 1,
  },
  nikay_en: {
    type: String,
    required: true,
  },
  nikay_hi: {
    type: String,
    required: true,
  },
  nikay_kn: {
    type: String,
    required: true,
  },
  nikay_mr: {
    type: String,
    required: true,
  },
  nikay_gu: {
    type: String,
    required: true,
  },
  nikay_ml: {
    type: String,
    required: true,
  },
  nikay_pu: {
    type: String,
    required: true,
  },
  nikay_bn: {
    type: String,
    required: true,
  },
  nikay_te: {
    type: String,
    required: true,
  },
  nikay_ta: {
    type: String,
    required: true,
  },
  nikay_or: {
    type: String,
    required: true,
  },
  nikay_lus: {
    type: String,
    required: true,
  },
  nikay_as: {
    type: String,
    required: true,
  },
  nikay_doi: {
    type: String,
    required: true,
  },
});

const Nikay = mongoose.model("Nikay", nikaySchema);

module.exports = Nikay;
