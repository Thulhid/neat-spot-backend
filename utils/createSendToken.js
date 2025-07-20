const jsonwebtoken = require("jsonwebtoken");

const signToken = (id, role) =>
  jsonwebtoken.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.createSendToken = (user, statusCode, res, role = "customer") => {
  const jwt = signToken(user._id, role);

  const cookieOptions = {
    expires: new Date(
      Date.now() + Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true; //  Required for SameSite: 'none'
    cookieOptions.sameSite = "none"; // Cross-site cookie support
  } else {
    cookieOptions.sameSite = "lax"; // Optional: allow minimal cross-site in dev
  }

  res.cookie("jwt", jwt, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    message: "Login successful",
    jwt,
    data: {
      user,
    },
  });
};
