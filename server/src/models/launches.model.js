const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const launches = new Map();
const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchData: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true
};

// launches.set(launch.flightNumber, launch);
saveLaunch(launch);

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDatabase.findOne().sort("-flightNumber");
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}
async function getAllLaunches() {
  // return Array.from(launchesDatabase.values());
  return await launchesDatabase.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
  const planet = await planets.findOne(
    { keplerName: launch.target },
    { _id: 0, __v: 0 }
  );
  if (!planet) {
    throw new Error("No Matching Planet Found!");
  }
  await launchesDatabase.updateOne(
    { flightNumber: launch.flightNumber },
    launch,
    {
      upsert: true
    }
  );
}

function addNewLaunch(launch) {
  latestFlightNumber++;
  launchesDatabase.set(
    latestFlightNumber,
    Object.assign(launch, {
      flightNumber: latestFlightNumber,
      customers: ["ZTM", "NASA"],
      upcoming: true,
      success: true
    })
  );
}

function existsLaunchWithId(launchId) {
  return launchesDatabase.has(Number(launchId));
}

function abortLaunchById(launchId) {
  const aborted = launchesDatabase.get(Number(launchId));
  //NOTE Even though aborted is constant we cannot reassign it, we can mutate its properties by reassigning
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById
};
