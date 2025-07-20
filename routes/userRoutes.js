const express = require("express");
const {
  signup,
  login,
  logout,
  protect,
  restrictTo,
} = require("../controllers/authController");
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getMe,
} = require("../controllers/userController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

router.use(protect);
router.get("/me", getMe, getUser);

router.use(restrictTo("admin"));

router.get("/", getAllUsers);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
