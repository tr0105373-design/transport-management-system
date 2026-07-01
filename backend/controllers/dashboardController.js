const pool = require("../config/db");

const getDashboardStats = async (req, res) => {
  try {

    const totalStudents = await pool.query(
      "SELECT COUNT(*) FROM students"
    );

    const totalVehicles = await pool.query(
      "SELECT COUNT(*) FROM vehicles"
    );

    const totalDrivers = await pool.query(
      "SELECT COUNT(*) FROM drivers"
    );

    const activeVehicles = await pool.query(
      "SELECT COUNT(*) FROM vehicles WHERE status='Active'"
    );

    const inactiveVehicles = await pool.query(
      "SELECT COUNT(*) FROM vehicles WHERE status!='Active'"
    );

    res.status(200).json({
      totalStudents: parseInt(totalStudents.rows[0].count),
      totalVehicles: parseInt(totalVehicles.rows[0].count),
      totalDrivers: parseInt(totalDrivers.rows[0].count),
      activeVehicles: parseInt(activeVehicles.rows[0].count),
      inactiveVehicles: parseInt(inactiveVehicles.rows[0].count),
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

module.exports = {
  getDashboardStats,
};