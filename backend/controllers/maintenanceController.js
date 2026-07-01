const pool = require("../config/db");
const { addActivity } = require("./activityController");

// Add Maintenance
const addMaintenance = async (req, res) => {
  try {

    const {
      vehicle_id,
      last_service,
      next_service,
      cost,
      status,
      remarks
    } = req.body;

    const maintenance = await pool.query(
      `INSERT INTO maintenance
      (vehicle_id,last_service,next_service,cost,status,remarks)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [
        vehicle_id,
        last_service,
        next_service,
        cost,
        status,
        remarks
      ]
    );

    await addActivity(
  "Maintenance Added",
  `Maintenance added for Vehicle ID ${vehicle_id}.`
);

    res.status(201).json({
      message: "Maintenance Added Successfully",
      maintenance: maintenance.rows[0]
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};

// Get All Maintenance
const getMaintenance = async (req, res) => {
  try {

    const maintenance = await pool.query(`
      SELECT
        m.*,
        v.vehicle_number
      FROM maintenance m
      JOIN vehicles v
      ON m.vehicle_id = v.id
      ORDER BY m.id DESC
    `);

    res.json(maintenance.rows);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};

// Update Maintenance
const updateMaintenance = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      vehicle_id,
      last_service,
      next_service,
      cost,
      status,
      remarks
    } = req.body;

    const updated = await pool.query(
      `UPDATE maintenance
       SET
       vehicle_id=$1,
       last_service=$2,
       next_service=$3,
       cost=$4,
       status=$5,
       remarks=$6
       WHERE id=$7
       RETURNING *`,
      [
        vehicle_id,
        last_service,
        next_service,
        cost,
        status,
        remarks,
        id
      ]
    );

    await addActivity(
  "Maintenance Updated",
  `Maintenance updated for Vehicle ID ${vehicle_id}.`
);

    res.json({
      message: "Maintenance Updated",
      maintenance: updated.rows[0]
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};

// Delete Maintenance
const deleteMaintenance = async (req, res) => {
  try {

    const { id } = req.params;

    const maintenance = await pool.query(
  "SELECT vehicle_id FROM maintenance WHERE id=$1",
  [id]
);

    await pool.query(
      "DELETE FROM maintenance WHERE id=$1",
      [id]
    );

    if (maintenance.rows.length > 0) {

  await addActivity(
    "Maintenance Deleted",
    `Maintenance deleted for Vehicle ID ${maintenance.rows[0].vehicle_id}.`
  );

}

    res.json({
      message: "Maintenance Deleted"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};

module.exports = {
  addMaintenance,
  getMaintenance,
  updateMaintenance,
  deleteMaintenance
};