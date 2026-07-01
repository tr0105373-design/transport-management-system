const { addActivity } = require("./activityController");
const pool = require("../config/db");

// ======================
// ADD FEE
// ======================
const addFee = async (req, res) => {
  try {

    const {
      student_id,
      amount,
      due_date
    } = req.body;

    const fee = await pool.query(
      `INSERT INTO transport_fees
      (student_id, amount, due_date)
      VALUES ($1,$2,$3)
      RETURNING *`,
      [
        student_id,
        amount,
        due_date
      ]
    );

    await addActivity(
      "Fee Added",
      `Transport fee added successfully.`
    );

    res.status(201).json({
      message: "Fee Added Successfully",
      fee: fee.rows[0]
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};

// ======================
// GET FEES
// ======================
const getFees = async (req, res) => {
  try {

    const fees = await pool.query(`
      SELECT
      tf.*,
      s.student_name
      FROM transport_fees tf
      JOIN students s
      ON tf.student_id = s.id
      ORDER BY tf.id DESC
    `);

    res.json(fees.rows);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};

// ======================
// UPDATE FEE STATUS
// ======================
const updateFeeStatus = async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query(
      `UPDATE transport_fees
       SET status='Paid',
           payment_date=CURRENT_DATE
       WHERE id=$1`,
      [id]
    );

    await addActivity(
      "Fee Paid",
      "Transport fee marked as Paid."
    );

    res.json({
      message: "Fee Updated Successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};

// ======================
// DELETE FEE
// ======================
const deleteFee = async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query(
      "DELETE FROM transport_fees WHERE id=$1",
      [id]
    );

    await addActivity(
      "Fee Deleted",
      "Transport fee deleted successfully."
    );

    res.json({
      message: "Fee Deleted Successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};

module.exports = {
  addFee,
  getFees,
  updateFeeStatus,
  deleteFee
};