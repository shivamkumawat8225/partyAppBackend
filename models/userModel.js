const { mongoose, version } = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
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
    name_gu: {
      type: String,
    },
    father_name: {
      type: String,
      default: "",
    },
    father_name_hi: {
      type: String,
    },
    father_name_en: {
      type: String,
    },
    father_name_as: {
      type: String,
    },
    father_name_gu: {
      type: String,
    },
    email: {
      type: String,
      default: "",
    },
    age: {
     type: Number,
     default: 0,
    },
    mobile: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      required: true,
    },
    profession: {
      type: Number,
      default: 0,
    },
    category: {
      type: Number,
      default: 0,
    },
    whatsapp: {
      type: Number,
      default: 0,
    },
    caste: {
      type: Number,
    },
    gender: {
      type: Number,
      default: 1,
    },
    password: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: "",
    },

    token: {
      type: String,
      default: "",
    },

    assign_family: {
      type: Number,
      default: 0,
    },

    whatsapp_prabhari: {
      type: Number,
      default: 0,
    },
    speaker: {
      type: Number,
      default: 0,
    },
    polling_agent: {
      type: Number,
      default: 0,
    },
    table_prabhari: {
      type: Number,
      default: 0,
    },
    patrol_team: {
      type: Number,
      default: 0,
    },

    stateid: {
      type: [Number],
      default: [],
    },
    loksabhaid: {
      type: [Number],
      default: [],
    },
    jilaid: {
      type: [Number],
      default: [],
    },
    vidhansabhaid: {
      type: [Number],
      default: [],
    },
    blockid: {
      type: [Number],
      default: [],
    },
    zoneid: {
      type: [Number],
      default: [],
    },
    sectorid: {
      type: [Number],
      default: [],
    },
    boothid: {
      type: [Number],
      default: [],
    },

    nikayid: {
      type: [Number],
      default: [],
    },

    wardid: {
      type: [Number],
      default: [],
    },
    status: {
      type: String,
      default: "0",
    },
    entrydatetime: {
      type: Date,
    },
    gcmtoken: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    oldid: {
      type: String,
      // default: "",
    },
    oldrole: {
      type: String,
      // default: "",
    },
    sr_start: {
      type: Number,
      default: 0,
    },
    sr_end: {
      type: Number,
      default: 0,
    },
    socketId: {
      type: String, // Socket ID for connection management
      // required: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    longitude: {
      type: String
    },
    latitude: {
      type: String
    },
    ip: {
      type: String
    },
    isActive: { type: Boolean, default: false },
    narajReason:{
      type: String,
    }
  },
  { versionKey: false }
);
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
