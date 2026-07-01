const pool = require("../config/db");
const { addActivity } = require("./activityController");

// Add Vehicle
const addVehicle = async (req, res) => {
  try {
    const {
      vehicle_number,
      vehicle_type,
      capacity,
      insurance_expiry,
      permit_expiry,
    } = req.body;

    const vehicle = await pool.query(
      `INSERT INTO vehicles
      (vehicle_number, vehicle_type, capacity, insurance_expiry, permit_expiry)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [
        vehicle_number,
        vehicle_type,
        capacity,
        insurance_expiry,
        permit_expiry,
      ]
    );

    await addActivity(
  "Vehicle Added",
  `${vehicle_number} was added successfully.`
   );

    res.status(201).json({
      message: "Vehicle Added Successfully",
      vehicle: vehicle.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get All Vehicles
const getVehicles = async (req, res) => {
  try {
    const vehicles = await pool.query(
      "SELECT * FROM vehicles ORDER BY id ASC"
    );


    res.status(200).json(vehicles.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Update Vehicle
const updateVehicle = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      vehicle_number,
      vehicle_type,
      capacity,
      insurance_expiry,
      permit_expiry,
    } = req.body;

    const vehicle = await pool.query(
      `UPDATE vehicles
       SET vehicle_number=$1,
           vehicle_type=$2,
           capacity=$3,
           insurance_expiry=$4,
           permit_expiry=$5
       WHERE id=$6
       RETURNING *`,
      [
        vehicle_number,
        vehicle_type,
        capacity,
        insurance_expiry,
        permit_expiry,
        id,
      ]
    );

    await addActivity(
    "Vehicle Updated",
  `${vehicle_number} was updated successfully.`
   );

    res.json({
      message: "Vehicle Updated Successfully",
      vehicle: vehicle.rows[0],
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Delete Vehicle
const deleteVehicle = async (req, res) => {
  try {

    const { id } = req.params;

    const vehicle = await pool.query(
     "SELECT vehicle_number FROM vehicles WHERE id=$1",
  [id]
   );

    await pool.query(
      "DELETE FROM vehicles WHERE id=$1",
      [id]
    );

    if (vehicle.rows.length > 0) {

  await addActivity(
    "Vehicle Deleted",
    `${vehicle.rows[0].vehicle_number} was deleted.`
  );

  }

    res.json({
      message: "Vehicle Deleted Successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  addVehicle,
  getVehicles,
  updateVehicle,
  deleteVehicle,
};