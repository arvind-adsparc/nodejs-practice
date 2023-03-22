const express = require("express");
const {
  httpGetLaunches,
  httpAddNewLaunch,
  httpDeleteLaunch,
} = require("./launches.controller.js");
const launchesRouter = express.Router();

launchesRouter.get("/", httpGetLaunches);

launchesRouter.post("/", httpAddNewLaunch);

launchesRouter.delete("/", httpDeleteLaunch);

module.exports = launchesRouter;
