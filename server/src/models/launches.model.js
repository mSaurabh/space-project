const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

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

  //NOTE replacing updateOne with findOneAndUpdate method
  //     to avoid $setOnInsert property being set.
  //NOTE findOneAndUpdate returns only the properties we
  //     set in our update.
  //await launchesDatabase.updateOne(
  await launchesDatabase.findOneAndUpdate(
    { flightNumber: launch.flightNumber },
    launch,
    {
      upsert: true
    }
  );
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["ZTM", "NASA"],
    flightNumber: newFlightNumber
  });

  await saveLaunch(newLaunch);
}

async function existsLaunchWithId(launchId) {
  return await launchesDatabase.findOne({ flightNumber: launchId });
}

async function abortLaunchById(launchId) {
  const aborted = await launchesDatabase.updateOne(
    { flightNumber: launchId },
    { upcoming: false, success: false }
  );

  return aborted.acknowledged === true && aborted.modifiedCount === 1;
  // const aborted = launchesDatabase.(Number(launchId));
  // //NOTE Even though aborted is constant we cannot reassign it, we can mutate its properties by reassigning
  // aborted.upcoming = false;
  // aborted.success = false;
  // return aborted;
}

module.exports = {
  getAllLaunches,
  // addNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
  scheduleNewLaunch
};
