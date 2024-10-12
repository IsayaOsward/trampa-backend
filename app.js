// app.js
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoute = require("./routes/userRoute");
const eventRoutes = require("./routes/eventRoutes");
const blogRoutes = require("./routes/blogRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const membershipRoutes = require("./routes/membershipRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const passportRoutes = require('./routes/passportRoutes');
const imageRoutes = require("./routes/homeImageRoutes");
const path = require("path");


// Parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

//Allow origins from all sites
app.use(cors());

// Define your routes
app.get("/api/v1/", (req, res) => {
  res.send({ success: true, message: "Servier is running successfully" });
});

//defining routes
app.use("/api/v1/", userRoute);
app.use("/api/v1/",eventRoutes);
app.use("/api/v1/", blogRoutes);
app.use('/api/v1/',resourceRoutes);
app.use("/api/v1/", membershipRoutes);
app.use("/api/v1/", passportRoutes);
// Serve uploaded files statically
app.use("/api/v1/gallery", galleryRoutes);
app.use("/api/v1/images/", imageRoutes);
// Serve uploaded images statically
app.use(
  "/api/v1/upload/gallery",
  express.static(path.join(__dirname, "uploads/gallery"))
);
app.use("/api/v1/uploads/home_images", express.static("uploads/home_images"));

// 404 Error Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "The resource you are looking for does not exist.",
  });
});

// Global Error Handler (optional)
// app.use((err, req, res, next) => {
//   res.status(err.status || 500).json({
//     message: "Internal Server Error",
//   });
// });

// Export the app for use in server.js
module.exports = app;
