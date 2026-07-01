const pool = require("../config/db");

const getAnalytics = async (req, res) => {
  try {

    const students = await pool.query("SELECT COUNT(*) FROM students");
    const vehicles = await pool.query("SELECT COUNT(*) FROM vehicles");
    const drivers = await pool.query("SELECT COUNT(*) FROM drivers");
    const routes = await pool.query("SELECT COUNT(*) FROM routes");

    // Vehicle Status
    const activeVehicles = await pool.query(`
      SELECT COUNT(*) FROM vehicles
      WHERE insurance_expiry >= CURRENT_DATE + INTERVAL '30 days'
    `);

    const expiringVehicles = await pool.query(`
      SELECT COUNT(*) FROM vehicles
      WHERE insurance_expiry BETWEEN CURRENT_DATE
      AND CURRENT_DATE + INTERVAL '30 days'
    `);

    const expiredVehicles = await pool.query(`
      SELECT COUNT(*) FROM vehicles
      WHERE insurance_expiry < CURRENT_DATE
    `);

    res.json({

      students: Number(students.rows[0].count),
      vehicles: Number(vehicles.rows[0].count),
      drivers: Number(drivers.rows[0].count),
      routes: Number(routes.rows[0].count),

      vehicleStatus: {
        active: Number(activeVehicles.rows[0].count),
        expiring: Number(expiringVehicles.rows[0].count),
        expired: Number(expiredVehicles.rows[0].count),
      }

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};

module.exports = {
  getAnalytics
};