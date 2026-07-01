const pool = require("../config/db");
const { addActivity } = require("./activityController");

// Add Driver
const addDriver = async (req, res) => {
  try {
    const {
      name,
      phone,
      license_number,
      experience,
      address
    } = req.body;

    const driver = await pool.query(
      `INSERT INTO drivers
      (name, phone, license_number, experience, address)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [
        name,
        phone,
        license_number,
        experience,
        address
      ]
    );

    await addActivity(
  "Driver Added",
  `${name} was added successfully.`
   );

    res.status(201).json({
      message: "Driver Added Successfully",
      driver: driver.rows[0]
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

// Get All Drivers
const getDrivers = async (req, res) => {
  try {

    const drivers = await pool.query(
      "SELECT * FROM drivers ORDER BY id ASC"
    );

    res.status(200).json(drivers.rows);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

// Update Driver
const updateDriver = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      name,
      phone,
      license_number,
      experience,
      address
    } = req.body;

    const updatedDriver = await pool.query(
      `UPDATE drivers
       SET name=$1,
           phone=$2,
           license_number=$3,
           experience=$4,
           address=$5
       WHERE id=$6
       RETURNING *`,
      [
        name,
        phone,
        license_number,
        experience,
        address,
        id
      ]
    );

    await addActivity(
  "Driver Updated",
  `${name} was updated successfully.`
   );

    res.status(200).json({
      message: "Driver Updated Successfully",
      driver: updatedDriver.rows[0]
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

// Delete Driver
const deleteDriver = async (req, res) => {
  try {

    const { id } = req.params;

    const driver = await pool.query(
  "SELECT name FROM drivers WHERE id=$1",
  [id]
  );

    await pool.query(
      "DELETE FROM drivers WHERE id=$1",
      [id]
    );

    if (driver.rows.length > 0) {

  await addActivity(
    "Driver Deleted",
    `${driver.rows[0].name} was deleted.`
  );

  }

    res.status(200).json({
      message: "Driver Deleted Successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

module.exports = {
  addDriver,
  getDrivers,
  updateDriver,
  deleteDriver
};