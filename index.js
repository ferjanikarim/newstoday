const express = require("express");
const scheduleJobs = require("./schedule-jobs");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const mongoUrl = process.env.DATABASE_URL;

mongoose.set("strictQuery", false);
mongoose.connect(mongoUrl);
const database = mongoose.connection;

database.on("error", (err) => {
  console.error(err);
});

database.on("connected", () => {
  console.log("database connected ...");
});

const app = express();

// start schedule jobs
// scheduleJobs();

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "public")));

// simple route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

require("./routes/news")(app);
require("./routes/user")(app);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`app start ${port}`);
});
