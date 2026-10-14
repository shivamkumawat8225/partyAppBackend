const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
    ref: 'User' // Reference to the User model
  },
//   username: {
//     type: String,
//     required: true
//   },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model('Location', locationSchema);