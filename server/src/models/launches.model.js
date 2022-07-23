const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");
const axios = require("axios");

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

const launch = {
  flightNumber: 100, //flight_number
  mission: "Kepler Exploration X", //name
  rocket: "Explorer IS1", // rocket.name
  launchData: new Date("December 27, 2030"), //date_local
  target: "Kepler-442 b", //not applicable
  customers: ["ZTM", "NASA"], // payload.customers for each payload
  upcoming: true, //upcoming
  success: true //success
};

// launches.set(launch.flightNumber, launch);
saveLaunch(launch);

async function populateLaunches() {
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1
          }
        },
        {
          path: "payloads",
          select: {
            customers: 1
          }
        }
      ]
    }
  });

  if (response.status !== 200) {
    console.log("Problem downloading launch data");
    throw new Error("Launch Data download failed!");
  }
  const launchDocs = response.data.docs;

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc.payloads;
    const customers = payloads.flatMap((payload) => {
      return payload.customers;
    });

    const launch = {
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchData: launchDoc.date_local,
      upcoming: launchDoc.upcoming,
      success: launchDoc.success,
      customers
    };
    // console.log(`${launch.flightNumber} ${launch.mission}`);
    await saveLaunch(launch);
  }
}
async function loadLaunchData() {
  console.log("Dowloading launch data...");
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat"
  });

  if (firstLaunch) {
    console.log("Launch data already loaded");
  } else {
    await populateLaunches();
  }
}

async function findLaunch(filter) {
  return await launchesDatabase.findOne(filter);
}

async function existsLaunchWithId(launchId) {
  return await findLaunch({ flightNumber: launchId });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDatabase.findOne().sort("-flightNumber");
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

async function getAllLaunches(skip, limit) {
  // return Array.from(launchesDatabase.values());
  return await launchesDatabase
    .find({}, { _id: 0, __v: 0 })
    .skip(skip)
    .limit(limit);
}

async function saveLaunch(launch) {
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
  const planet = await planets.findOne(
    { keplerName: launch.target },
    { _id: 0, __v: 0 }
  );

  if (!planet) {
    throw new Error("No Matching Planet Found!");
  }

  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["ZTM", "NASA"],
    flightNumber: newFlightNumber
  });

  await saveLaunch(newLaunch);
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
  scheduleNewLaunch,
  loadLaunchData
};
