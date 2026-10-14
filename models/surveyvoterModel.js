const { mongoose, version } = require("mongoose");

const surveyvoterSchema = new mongoose.Schema(
  {
    familyid: {
      type: Number,
      required: true,
    },
    //voter
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    name_en: {
      type: String,
    },
    name_hi: {
      type: String,
    },
    name_as: {
      type: String,
    },

    rel: {
      type: String,
    },
    rel_name: {
      type: String,
    },
    rel_name_en: {
      type: String,
    },
    rel_name_hi: {
      type: String,
    },
    rel_name_as: {
      type: String,
    },
    mobile: {
      type: String,
      // required: true,
    },
    whatsapp: {
      type: Number,
      default: 0,
    },
    educationid: {
      type: Number,
      default: 0,
    },
    education_status: {
      type: Number,
    },
    professionid: {
      type: Number,
      default: 0,
    },

    dob: {
      type: Date,
    },
    doa: {
      type: Date,
    },
    current_address: {
      type: String,
    },
    partyid: {
      type: Number,
      default: 0,
    },

    voterId: {
      type: String,
    },
    gender: {
      type: Number,
      default: "1",
    },
    disable_voter: {
      type: Number,
      default: 0,
    },
    age: {
      type: Number,
    },
    head: {
      type: Number,
      default: 0,
    },

    page_to: {
      type: Number,
    },
    page_from: {
      type: Number,
    },
    image: {
      type: String,
    },
    caste_dominant: {
      type: Number,
      default: 0,
    },
    head_of_religion: {
      type: Number,
      default: 0,
    },
    first_time_voter: {
      type: Number,
      default: 0,
    },
    vote: {
      type: Number,
      default: 0,
    },
    voter_kramank: {
      type: Number,
      default: 0,
    },

    booth_speaker: {
      type: Number,
      default: 0,
    },

    support_worker: {
      type: Number,
      default: 0,
    },
    opposite_party_worker: {
      type: Number,
      default: 0,
    },

    stateid: {
      type: Number,
      default: 0,
    },
    loksabhaid: {
      type: Number,
      default: 0,
    },
    jilaid: {
      type: Number,
      default: 0,
    },
    vidhansabhaid: {
      type: Number,
      default: 0,
    },
    blockid: {
      type: Number,
      default: 0,
    },
    zoneid: {
      type: Number,
      default: 0,
    },
    sectorid: {
      type: Number,
      default: 0,
    },
    boothid: {
      type: Number,
      default: 0,
    },
    nikayid: {
      type: Number,
      default: 0,
    },
    wardid: {
      type: Number,
      default: 0,
    },
    outoftown: {
      type: Number,
      default: 0,
    },
    out_place: {
      type: String,
      default: "",
    },
    out_distanse: {
      type: String,
      default: "",
    },
    age: {
      type: Number,
      default: 0,
    },
    jankalyan_yojana: {
      type: String,
      default: "",
    },
    voter_kramank_no:{
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "0",
    },
    entrydatetime: {
      type: Date,
    },
  },
  { versionKey: false }
);

const Surveyvoter = mongoose.model("Surveyvoter", surveyvoterSchema);

module.exports = Surveyvoter;
