const pool = require("../config/db");

// ======================
// ADD ACTIVITY
// ======================
const addActivity = async (action, description) => {
  try {

    await pool.query(
      `INSERT INTO activities (action, description)
       VALUES ($1,$2)`,
      [action, description]
    );

  } catch (error) {

    console.log("ACTIVITY ERROR:", error.message);

  }
};

// ======================
// GET ACTIVITIES
// ======================
const getActivities = async (req, res) => {
  try {

    const activities = await pool.query(
      "SELECT * FROM activities ORDER BY created_at DESC"
    );

    res.json(activities.rows);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};

// ======================
// DELETE SINGLE ACTIVITY
// ======================
const deleteActivity = async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query(
      "DELETE FROM activities WHERE id=$1",
      [id]
    );

    res.json({
      message: "Activity Deleted Successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};

// ======================
// CLEAR ALL ACTIVITIES
// ======================
const clearActivities = async (req, res) => {
  try {

    await pool.query("DELETE FROM activities");

    res.json({
      message: "All Activities Cleared"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};

module.exports = {
  addActivity,
  getActivities,
  deleteActivity,
  clearActivities
};