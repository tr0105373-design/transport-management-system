const express = require("express");

const router = express.Router();

const {
  getActivities,
  deleteActivity,
  clearActivities
} = require("../controllers/activityController");

// Get all activities
router.get("/", getActivities);

// Delete single activity
router.delete("/:id", deleteActivity);

// Clear all activities
router.delete("/", clearActivities);

module.exports = router;