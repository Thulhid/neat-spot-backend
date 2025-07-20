const express = require("express");
const {
  getAllServices,
  createService,
  updateService,
  deleteService,
  getService,
} = require("../controllers/serviceController");
const { restrictTo, protect } = require("../controllers/authController");

const router = express.Router();
// Apply authentication middleware
router.use(protect);

router.route("/").get(getAllServices).post(restrictTo("admin"), createService);

// Restrict access to admin-only
router.use(restrictTo("admin"));
router.route("/:id").get(getService).put(updateService).delete(deleteService);

module.exports = router;
