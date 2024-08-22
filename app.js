// app.js
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoute = require("./routes/userRoute");
const eventRoutes = require("./routes/eventRoutes");

// Parse application/json
app.use(bodyParser.json());

//Allow origins from all sites
app.use(cors());

// Define your routes
app.get("/", (req, res) => {
  res.send({ success: true, message: "Servier is running successfully" });
});

//defining routes
app.use("/api/v1", userRoute);
app.use("/api/v1/",eventRoutes);


// Export the app for use in server.js
module.exports = app;
