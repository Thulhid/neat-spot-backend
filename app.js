const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/userRoutes");
const serviceRouter = require("./routes/serviceRoutes");
const bookingRouter = require("./routes/bookingRoutes");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

// Define the list of allowed origins for CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "https://neat-spot.netlify.app"],
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

app.use(globalErrorHandler);

module.exports = app;
