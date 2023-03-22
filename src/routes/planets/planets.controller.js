// const { planets } = require("../../models/planets.model.js");

const planets = require("../../models/planets.mongo");

async function httpGetPlanets(req, res) {
  const data = await planets.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
  return res.status(200).json({ success: true, data });
}

module.exports = {
  httpGetPlanets,
};
