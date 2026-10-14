const { mongoose, version } = require("mongoose");

const surveyfamilySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    house_no: {
      type: String,
    },
    familyid: {
      type: Number,
    },
    religionid: {
      type: Number,
    },
    casteid: {
      type: Number,
      default: 0
    },
    castename: {
      type: String,
    },
    categoryid: {
      type: Number,
    },

    total_voters_count: {
      type: Number,
    },

    out_of_voter_count: {
      type: Number,
    },

    new_voters_count: {
      type: Number,
    },

    dead_voter_count: {
      type: Number,
    },

    card_type: {
      type: Number,
    },
    economics_condition: {
      type: Number,
    },
    vehicals: {
      type: String,
    },

    nikay_approve: {
      type: Number,
      default: 0,
    },
    nikay_approve_apr_by: {
      type: String,
    },

    block_approve: {
      type: Boolean,
    },
    vidhansabha_approve: {
      type: Boolean,
    },
    loksabha_approve: {
      type: Boolean,
    },
    state_approve: {
      type: Boolean,
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
    status: {
      type: Number,
      default: 0,
    },
    entrydatetime: {
      type: Date,
    },
    pralobhan_prabhivit_parivar: {
      type: Number,
      default: 0,
    },
    patra_hitkari_parivar: {
      type: Number,
      default: 0,
    },
    permanent_address:{
      type:String,
    },
    new_voter_count_field:{
      type:Number,
      default:0,
    }

  },
  { versionKey: false }
);

const Surveyfamily = mongoose.model("Surveyfamily", surveyfamilySchema);

module.exports = Surveyfamily;
