const express = require("express");

const router = express.Router();

const {
  addDriver,
  getDrivers,
  updateDriver,
  deleteDriver
} = require("../controllers/driverController");

// Add Driver
router.post("/", addDriver);

// Get All Drivers
router.get("/", getDrivers);

// Update Driver
router.put("/:id", updateDriver);

// Delete Driver
router.delete("/:id", deleteDriver);

module.exports = router;