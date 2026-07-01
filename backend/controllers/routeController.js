const pool = require("../config/db");
const { addActivity } = require("./activityController");

// Add Route
const addRoute = async (req, res) => {
  try {
    const {
      route_name,
      source,
      destination,
      distance
    } = req.body;

    const route = await pool.query(
      `INSERT INTO routes
      (route_name, source, destination, distance)
      VALUES ($1,$2,$3,$4)
      RETURNING *`,
      [
        route_name,
        source,
        destination,
        distance
      ]
    );

    await addActivity(
  "Route Added",
  `${route_name} route was added successfully.`
   );

    res.status(201).json({
      message: "Route Added Successfully",
      route: route.rows[0]
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

// Get All Routes
const getRoutes = async (req, res) => {
  try {

    const routes = await pool.query(
      "SELECT * FROM routes ORDER BY id ASC"
    );

    res.status(200).json(routes.rows);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

// Update Route
const updateRoute = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      route_name,
      source,
      destination,
      distance
    } = req.body;

    const updatedRoute = await pool.query(
      `UPDATE routes
       SET route_name=$1,
           source=$2,
           destination=$3,
           distance=$4
       WHERE id=$5
       RETURNING *`,
      [
        route_name,
        source,
        destination,
        distance,
        id
      ]
    );

    await addActivity(
  "Route Updated",
  `${route_name} route was updated successfully.`
);

    res.status(200).json({
      message: "Route Updated Successfully",
      route: updatedRoute.rows[0]
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

// Delete Route
const deleteRoute = async (req, res) => {
  try {

    const { id } = req.params;

    const route = await pool.query(
  "SELECT route_name FROM routes WHERE id=$1",
  [id]
);

    await pool.query(
      "DELETE FROM routes WHERE id=$1",
      [id]
    );

    if (route.rows.length > 0) {

  await addActivity(
    "Route Deleted",
    `${route.rows[0].route_name} route was deleted.`
  );

}

    res.status(200).json({
      message: "Route Deleted Successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

module.exports = {
  addRoute,
  getRoutes,
  updateRoute,
  deleteRoute
};