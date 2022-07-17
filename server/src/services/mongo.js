const mongoose = require("mongoose");

//TODO Update below to match your own MongoDB connection string.
const MONGO_URL =
  "mongodb+srv://nasa-api:gW1hZhV3gPw1IK1T@nasacluster.3gf5lof.mongodb.net/?retryWrites=true&w=majority";

//NOTE: .once method runs the emitted event only once
mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose err => ", err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}
module.exports = {
  mongoConnect,
  mongoDisconnect
};
