const http = require("http");
const mongoose = require("mongoose");

const app = require("./app");
const { loadPlanetsData } = require("./models/planets.model");

const PORT = process.env.PORT || 8000;

const MONGO_URL =
  "mongodb+srv://nasa-api:gW1hZhV3gPw1IK1T@nasacluster.3gf5lof.mongodb.net/?retryWrites=true&w=majority";

//NOTE: .once method runs the emitted event only once
mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose err => ", err);
});

const server = http.createServer(app);

async function startServer() {
  await mongoose.connect(MONGO_URL);
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}...`);
  });
}

startServer();
