const {
  getLaunches,
  scheduleNewLaunch,
  deleteLaunch,
} = require("../../models/launches.model");

const { getPagination } = require("../../services/query");

async function httpGetLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);
  return res.status(200).json(await getLaunches(skip, limit));
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  launch.launchDate = new Date(launch.launchDate);
  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

async function httpDeleteLaunch(req, res) {
  const aborted = await deleteLaunch(req.body.flightNumber);
  return res.status(200).json(aborted);
}

module.exports = {
  httpGetLaunches,
  httpAddNewLaunch,
  httpDeleteLaunch,
};
