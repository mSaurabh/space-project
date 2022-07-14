const mongoose = require("mongoose");

const planetsSchema = new mongoose.Schema({
  //NOTE This is how we have named it in Launch.js file
  keplerName: {
    type: String,
    required: true
  }
});

//NOTE V V Important, you always specify the name of collection in singular form
// when the model is compiled by mongoose it converts it to the lower case and plural form "planets" under the hood.
module.exports = mongoose.model("Planet", planetsSchema);
