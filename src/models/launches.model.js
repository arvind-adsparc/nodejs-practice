const axios = require("axios");
const launchs = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = "https://api.spacexdata.com/v5/launches/query";

async function getLatestFlightNumber() {
  const latestLaunch = await launchs.findOne().sort("-flightNumber");

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function getLaunches(skip, limit) {
  return await launchs
    .find(
      {},
      {
        _id: 0,
        __v: 0,
      }
    )
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function populateLaunches() {
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            name: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log("problem downloading data");
    throw new Error("Launch Data");
  }

  const launchDocs = response.data.docs;

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => payload["customers"]);
    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };

    console.log(launch.mission);

    await saveLaunch(launch);
  }
}

async function loadLaunchData() {
  console.log("data");

  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (firstLaunch) {
    console.log("already loaded");
    return;
  }

  await populateLaunches();
}

async function findLaunch(filter) {
  return await launchs.findOne(filter);
}

async function saveLaunch(launch) {
  await launchs.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function scheduleNewLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet found!");
  }
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    customer: ["ZMA", "NASA"],
    upcoming: true,
    flightNumber: newFlightNumber,
  });

  saveLaunch(newLaunch);
}

// function addNewLaunch(launch) {
//   latestFlightNumber += 1;
//   launchs.set(
//     latestFlightNumber,
//     Object.assign(launch, {
//       success: true,
//       customer: ["ZMA", "NASA"],
//       upcoming: true,
//       flightNumber: latestFlightNumber,
//     })
//   );
// }

async function deleteLaunch(launchNumber) {
  const launch = await launchs.deleteOne({
    flightNumber: launchNumber,
  });

  return launch;
}

module.exports = {
  loadLaunchData,
  getLaunches,
  scheduleNewLaunch,
  deleteLaunch,
};
