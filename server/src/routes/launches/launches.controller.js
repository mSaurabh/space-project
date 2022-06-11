const { getAllLaunches } = require("../../models/launches.model");

function httpGetAllLaunches(req, res) {
  //NOTE converting map to array using Array.from
  return res.status(200).json(getAllLaunches);
}

module.exports = {
  httpGetAllLaunches
};
