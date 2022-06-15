const express = require("express");

const {
  httpGetAllPlanets
} = require("../../routes/planets/planets.controller");

const planetsRouter = express.Router();

planetsRouter.get("/", httpGetAllPlanets);

module.exports = planetsRouter;
