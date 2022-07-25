require("dotenv").config();
const mongoose = require("mongoose");

//TODO Update below to match your own MongoDB connection string.
const MONGO_URL = process.env.MONGO_URL;

//NOTE: .once method runs the emitted event only once
mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose err => ", err);
});

function mongoConnect() {
  mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}
module.exports = {
  mongoConnect,
  mongoDisconnect
};
