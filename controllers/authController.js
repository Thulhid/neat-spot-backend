const jsonwebtoken = require("jsonwebtoken");
const { promisify } = require("util");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { createSendToken } = require("../utils/createSendToken");
const User = require("../models/userModel");

/**
 * Middleware to protect routes and ensure user is authenticated.
 * Verifies JWT token from header or cookie and attaches user to request.
 */
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  const decoded = await promisify(jsonwebtoken.verify)(
    token,
    process.env.JWT_SECRET
  );

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exists.", 401)
    );
  }

  req.user = currentUser;
  next();
});

exports.updatePassword = (Model) =>
  catchAsync(async (req, res, next) => {
    //idea: 1) Get user from collection
    const user = await Model.findById(req.user.id).select("+password");
    //idea: 2) Check if update password is equal current password
    if (
      !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      return next(new AppError("Your current password is wrong.", 401));
    }
    //idea: 3) If so, update password
    user.password = req.body.password;
    user.password_confirm = req.body.password_confirm;
    await user.save();

    //idea: 4) Log user in, send JWT
    createSendToken(user, 200, res, user?.role);
  });

//Note: signup
exports.signup = catchAsync(async (req, res, next) => {
  const { full_name, username, password, password_confirm, mobile_number } =
    req.body;

  const newCustomer = await User.create({
    full_name,
    username,
    password,
    password_confirm,
    mobile_number,
  });

  const customer = await newCustomer.save({ validateBeforeSave: false });

  createSendToken(customer, 201, res);
});

//Note: login
exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  // idea: 1.Check if username and password exist
  if (!username || !password) {
    return next(new AppError("Please provide username and password!", 400));
  }

  // idea: 2.Check if user exists && password is correct
  const user = await User.findOne({ username }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect username or password", 401));
  }

  // idea: 3.If everything ok, send token to client
  createSendToken(user, 200, res, user.role);
});

//Note: logout
exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", //  match prod settings
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", //  match original
  });

  res.status(200).json({ status: "success", message: "Logged out" });
};

exports.restrictTo =
  (...roles) =>
  //roles can access for middlewares because CLOSUERS
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
