const Booking = require("../models/bookingModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

//Controller to get bookings of the currently logged-in user.
exports.getMyBooking = (req, res, next) => {
  factory.getAll(
    Booking,
    { path: "service_id", select: "name" },
    { user_id: req.user.id }
  )(req, res, next);
};

/**
 * Controller to get all bookings (admin-level access).
 * Populates the username and service name from referenced models.
 */
exports.getAllBooking = (req, res, next) => {
  factory.getAll(Booking, [
    { path: "user_id", select: "username" },
    { path: "service_id", select: "name" },
  ])(req, res, next);
};

// Controller to get a single booking by ID.
exports.getBooking = factory.getOne(Booking);
exports.createBooking = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("full_name");
  factory.createOne(Booking, {
    user_id: req.user.id,
    customer_name: user.full_name,
  })(req, res, next);
});
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
