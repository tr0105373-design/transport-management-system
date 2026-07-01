const { addActivity } = require("./activityController");
const pool = require("../config/db");

// ======================
// ADD STUDENT
// ======================
const addStudent = async (req, res) => {
  try {

    const {
      student_name,
      class: studentClass,
      phone,
      pickup_point,
      vehicle_id,
      driver_id,
      route_id
    } = req.body;

    const student = await pool.query(
      `INSERT INTO students
      (student_name, class, phone, pickup_point, vehicle_id, driver_id, route_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [
        student_name,
        studentClass,
        phone,
        pickup_point,
        vehicle_id,
        driver_id,
        route_id
      ]
    );

    // Save Activity
    console.log("Calling addActivity");

    await addActivity(
      "Student Added",
      `${student_name} was added successfully.`
    );

    res.status(201).json({
      message: "Student Added Successfully",
      student: student.rows[0]
    });

  } catch (error) {

    console.log("FULL ERROR:", error);
    console.log("MESSAGE:", error.message);
    console.log("DETAIL:", error.detail);
    console.log("CODE:", error.code);

    res.status(500).json({
      error: error.message,
      detail: error.detail,
      code: error.code,
    });

  }
};

// ======================
// GET STUDENTS
// ======================
const getStudents = async (req, res) => {
  try {

    const search = req.query.search || "";

    const students = await pool.query(
      `
      SELECT
        s.id,
        s.student_name,
        s.class,
        s.phone,
        s.pickup_point,
        s.vehicle_id,
        s.driver_id,
        s.route_id,
        v.vehicle_number,
        d.name AS driver_name,
        r.route_name
      FROM students s
      LEFT JOIN vehicles v ON s.vehicle_id = v.id
      LEFT JOIN drivers d ON s.driver_id = d.id
      LEFT JOIN routes r ON s.route_id = r.id
      WHERE s.student_name ILIKE $1
      ORDER BY s.id ASC
      `,
      [`%${search}%`]
    );

    res.json({
      students: students.rows,
      totalStudents: students.rows.length
    });

  } catch (error) {

    console.log("GET ERROR:", error.message);

    res.status(500).json({
      message: "Server Error"
    });

  }
};
// ======================
// UPDATE STUDENT
// ======================
const updateStudent = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      student_name,
      class: studentClass,
      phone,
      pickup_point,
      vehicle_id,
      driver_id,
      route_id
    } = req.body;

    const updated = await pool.query(
      `UPDATE students
       SET
         student_name=$1,
         class=$2,
         phone=$3,
         pickup_point=$4,
         vehicle_id=$5,
         driver_id=$6,
         route_id=$7
       WHERE id=$8
       RETURNING *`,
      [
        student_name,
        studentClass,
        phone,
        pickup_point,
        vehicle_id,
        driver_id,
        route_id,
        id
      ]
    );

    // Save Activity
    await addActivity(
      "Student Updated",
      `${student_name} was updated successfully.`
    );

    res.json({
      message: "Student Updated Successfully",
      student: updated.rows[0]
    });

  } catch (error) {

    console.log("UPDATE ERROR:", error.message);

    res.status(500).json({
      message: "Server Error"
    });

  }
};

// ======================
// DELETE STUDENT
// ======================
const deleteStudent = async (req, res) => {
  try {

    const { id } = req.params;

    const student = await pool.query(
      "SELECT student_name FROM students WHERE id=$1",
      [id]
    );

    await pool.query(
      "DELETE FROM students WHERE id=$1",
      [id]
    );

    if (student.rows.length > 0) {
      await addActivity(
        "Student Deleted",
        `${student.rows[0].student_name} was deleted.`
      );
    }

    res.json({
      message: "Student Deleted Successfully"
    });

  } catch (error) {

    console.log("DELETE ERROR:", error.message);

    res.status(500).json({
      message: "Server Error"
    });

  }
};

// ======================
// EXPORTS
// ======================
module.exports = {
  addStudent,
  getStudents,
  updateStudent,
  deleteStudent
};