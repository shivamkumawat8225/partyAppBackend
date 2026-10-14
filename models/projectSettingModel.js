const { mongoose } = require("mongoose");

const projectsettingSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
  },

  projectsetting_kn: {
    type: String,
    required: true,
  },
});

const Projectsetting = mongoose.model("Projectsetting", projectsettingSchema);

module.exports = Projectsetting;
