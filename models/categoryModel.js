const { mongoose } = require("mongoose");

const categorySchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
  },
  category_en: {
    type: String,
    required: true,
  },
  category_hi: {
    type: String,
    required: true,
  },
  category_kn: {
    type: String,
    required: true,
  },
  category_mr: {
    type: String,
    required: true,
  },
  category_gu: {
    type: String,
    required: true,
  },
  category_ml: {
    type: String,
    required: true,
  },
  category_pu: {
    type: String,
    required: true,
  },
  category_bn: {
    type: String,
    required: true,
  },
  category_te: {
    type: String,
    required: true,
  },
  category_ta: {
    type: String,
    required: true,
  },
  category_or: {
    type: String,
    required: true,
  },
  category_lus: {
    type: String,
    required: true,
  },
  category_as: {
    type: String,
    required: true,
  },
  category_doi: {
    type: String,
    required: true,
  },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
