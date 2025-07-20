const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/userRoutes");
const serviceRouter = require("./routes/serviceRoutes");
const bookingRouter = require("./routes/bookingRoutes");

const app = express();

// Define the list of allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://neat-spot-bookings.vercel.app",
];

// Enable CORS with custom settings
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Parse incoming JSON data with a size limit
app.use(express.json({ limit: "10kb" }));

// Parse cookies from incoming requests
app.use(cookieParser());

//Note: Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/services", serviceRouter);
app.use("/api/v1/bookings", bookingRouter);

module.exports = app;
