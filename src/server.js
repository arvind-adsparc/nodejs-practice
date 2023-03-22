const http = require("http");
const mongoose = require("mongoose");

const app = require("./app");
const { loadPlanetsData } = require("./models/planets.model.js");
const { loadLaunchData } = require("./models/launches.model");

const PORT = process.env.PORT || 8000;

require("dotenv").config();

const MONGO_URL = process.env.DB_STRING;

const server = http.createServer(app);

mongoose.connection.on("open", () => {
  console.log("MongoDB connection ready");
});

mongoose.connection.on("error", (err) => {
  console.error("Something went wrong with MongoDB connection", err);
});

async function startServer() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await loadPlanetsData();
  await loadLaunchData();

  server.listen(PORT, () => {
    console.log("server is up and running!");
  });
}

startServer();
