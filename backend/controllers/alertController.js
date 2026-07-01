const pool = require("../config/db");

const getAlerts = async (req, res) => {
  try {

    let alerts = [];

    // Vehicle Insurance Expiry
    const insurance = await pool.query(`
      SELECT vehicle_number, insurance_expiry
      FROM vehicles
      WHERE insurance_expiry <= CURRENT_DATE + INTERVAL '30 days'
    `);

    insurance.rows.forEach((vehicle) => {
      alerts.push({
        title: "Insurance Expiry",
        message: `Vehicle ${vehicle.vehicle_number} insurance expires on ${new Date(vehicle.insurance_expiry).toLocaleDateString("en-IN")}`
      });
    });

    // Vehicle Permit Expiry
    const permits = await pool.query(`
      SELECT vehicle_number, permit_expiry
      FROM vehicles
      WHERE permit_expiry <= CURRENT_DATE + INTERVAL '30 days'
    `);

    permits.rows.forEach((vehicle) => {
      alerts.push({
        title: "Permit Expiry",
        message: `Vehicle ${vehicle.vehicle_number} permit expires on ${vehicle.permit_expiry}`
      });
    });

    // Driver License Expiry
    const licenses = await pool.query(`
      SELECT name, license_expiry
      FROM drivers
      WHERE license_expiry IS NOT NULL
      AND license_expiry <= CURRENT_DATE + INTERVAL '30 days'
    `);

    licenses.rows.forEach((driver) => {
      alerts.push({
        title: "License Expiry",
        message: `Driver ${driver.name} license expires on ${driver.license_expiry}`
      });
    });

    res.json(alerts);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};

module.exports = {
  getAlerts
};