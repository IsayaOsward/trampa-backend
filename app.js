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
const passportRoutes = require("./routes/passportRoutes");
const imageRoutes = require("./routes/homeImageRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const homeSummaryRoutes = require("./routes/homeSummaryRoutes");
const path = require("path");

// Custom middleware to check request size
const checkRequestSize = (req, res, next) => {
  const contentLength = req.headers["content-length"];
  const maxSize = 20 * 1024 * 1024; // 20 MB in bytes

  if (contentLength && parseInt(contentLength) > maxSize) {
    return res
      .status(413)
      .json({ error: "Payload too large. Maximum allowed size is 10 MB." });
  }

  next();
};

// Use the custom middleware before the body parser
app.use(checkRequestSize);

// Increase the body size limit to 100MB
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

app.use("/uploads", express.static("uploads"));

// Allow origins from all sites
app.use(cors());

// Define your routes
app.get("/api/v1/", (req, res) => {
  res.send({ success: true, message: "Server is running successfully" });
});

// Defining routes
app.use("/api/v1/", userRoute);
app.use("/api/v1/", eventRoutes);
app.use("/api/v1/", blogRoutes);
app.use("/api/v1/", resourceRoutes);
app.use("/api/v1/", membershipRoutes);
app.use("/api/v1/", passportRoutes);
app.use("/api/v1/", announcementRoutes);
// Serve uploaded files statically
app.use("/api/v1/gallery", galleryRoutes);
app.use("/api/v1/images/", imageRoutes);
app.use("/api/v1/summary/", homeSummaryRoutes);
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




/**
 * 
 * 
 * 
 * Global Error Handler (optional)
 * 
 * 
 * 
 * */
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: "Internal Server Error",
  });
});

// Export the app for use in server.js
module.exports = app;
