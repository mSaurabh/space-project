const express = require("express");
const planetsRouter = require("./planets/planets.router");
const launchesRouter = require("./launches/launches.router");

const api = express.Router();

//NOTE This means that launchesRouter will only react to the /launches route
//     & planetsRouter will only react to /planets route
api.use("/launches", launchesRouter);
api.use("/planets", planetsRouter);

module.exports = api;
