const mongoose = require("mongoose");

const launchesSchema = new mongoose.Schema({
  flightNumber: {
    type: Number,
    required: true
  },
  launchData: {
    type: Date,
    required: true
  },
  mission: {
    type: String,
    required: true
  },
  rocket: {
    type: String,
    required: true
  },
  target: {
    type: String
    // required: true
  },
  customers: [String],
  upcoming: {
    type: Boolean,
    required: true
  },
  success: {
    type: Boolean,
    required: true,
    default: true
  }
});

//NOTE V V Important, you always specify the name of collection in singular form
// when the model is compiled by mongoose it converts it to the lower case and plural form "launches" under the hood.
module.exports = mongoose.model("Launch", launchesSchema);
