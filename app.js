const express = require("express");
const cors = require("cors");
const app = express();

// CORS configuration
app.use(
  cors({
    origin: "*", // Allow all origins (you can restrict this to specific domains later)
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

const urlRoutes = require("./routes/route");
const authroutes = require("./routes/authroutes");
const redirectRoutes = require("./routes/redirectRoutes");

app.use("/api", urlRoutes);
app.use("/auth", authroutes);
app.use("/", redirectRoutes);

// Health check (optional but useful)
app.get("/", (req, res) => {
  res.send("URL Shortener API running");
});

module.exports = app;
