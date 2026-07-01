const express = require("express");

const router = express.Router();

const {
  addMaintenance,
  getMaintenance,
  updateMaintenance,
  deleteMaintenance
} = require("../controllers/maintenanceController");

// Add Maintenance
router.post("/", addMaintenance);

// Get All Maintenance
router.get("/", getMaintenance);

// Update Maintenance
router.put("/:id", updateMaintenance);

// Delete Maintenance
router.delete("/:id", deleteMaintenance);

module.exports = router;