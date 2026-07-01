const pool = require("../config/db");
const { Parser } = require("json2csv");

// Export CSV
const exportCSV = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        s.student_name,
        s.class,
        s.phone,
        v.vehicle_number,
        d.name AS driver_name,
        r.route_name
      FROM students s
      LEFT JOIN vehicles v ON s.vehicle_id = v.id
      LEFT JOIN drivers d ON s.driver_id = d.id
      LEFT JOIN routes r ON s.route_id = r.id
      ORDER BY s.id
    `);

    const parser = new Parser();
    const csv = parser.parse(result.rows);

    res.header("Content-Type", "text/csv");
    res.attachment("transport-report.csv");

    return res.send(csv);

  } catch (error) {
    console.log("CSV Export Error:", error);
    res.status(500).json({
      message: "CSV Export Failed"
    });
  }
};

// Export Excel (Coming Soon)
const exportExcel = async (req, res) => {
  res.status(200).json({
    message: "Excel Export Coming Soon"
  });
};

// Export PDF (Coming Soon)
const exportPDF = async (req, res) => {
  res.status(200).json({
    message: "PDF Export Coming Soon"
  });
};

module.exports = {
  exportCSV,
  exportExcel,
  exportPDF
};