// app.js
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoute = require("./routes/userRoute");
const eventRoutes = require("./routes/eventRoutes");
const blogRoutes = require("./routes/blogRoutes");

// Parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

//Allow origins from all sites
app.use(cors());

// Define your routes
app.get("/", (req, res) => {
  res.send({ success: true, message: "Servier is running successfully" });
});

//defining routes
app.use("/api/v1/", userRoute);
app.use("/api/v1/",eventRoutes);
app.use("/api/v1/", blogRoutes);

// 404 Error Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "The resource you are looking for does not exist.",
  });
});

// // Global Error Handler (optional)
// app.use((err, req, res, next) => {
//   res.status(err.status || 500).json({
//     message: "Internal Server Error",
//   });
// });

// Export the app for use in server.js
module.exports = app;
