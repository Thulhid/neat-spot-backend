const express = require("express");
const { protect, restrictTo } = require("../controllers/authController");
const {
  getMyBooking,
  createBooking,
  deleteBooking,
  updateBooking,
  getAllBooking,
} = require("../controllers/bookingController");

const router = express.Router();

// Apply authentication middleware to all booking routes
router.use(protect);
router.route("/").get(getMyBooking).post(createBooking);
router.route("/:id").put(updateBooking).delete(deleteBooking);

// Restrict access to admin-only routes beyond this point
router.use(restrictTo("admin"));
router.get("/all", getAllBooking);
module.exports = router;
