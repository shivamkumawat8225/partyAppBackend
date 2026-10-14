const { mongoose } = require("mongoose");

const user_roleSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
  },
  role_en: {
    type: String,
    required: true,
  },
  role_hi: {
    type: String,
    required: true,
  },
  role_kn: {
    type: String,
    required: true,
  },
  role_mr: {
    type: String,
    required: true,
  },
  role_gu: {
    type: String,
    required: true,
  },
  role_ml: {
    type: String,
    required: true,
  },
  role_pu: {
    type: String,
    required: true,
  },
  role_bn: {
    type: String,
    required: true,
  },
  role_te: {
    type: String,
    required: true,
  },
  role_ta: {
    type: String,
    required: true,
  },
  role_or: {
    type: String,
    required: true,
  },
  role_lus: {
    type: String,
    required: true,
  },
  role_as: {
    type: String,
    required: true,
  },
  role_doi: {
    type: String,
    required: true,
  },
  role_type: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  add: {
    type: Number,
    required: true,
    default: 0,
  },
  edit: {
    type: Number,
    required: true,
    default: 0,
  },
  delete: {
    type: Number,
    required: true,
    default: 0,
  },
  view: {
    type: Number,
    required: true,
    default: 0,
  },
});

const User_role = mongoose.model("User_role", user_roleSchema);

module.exports = User_role;
