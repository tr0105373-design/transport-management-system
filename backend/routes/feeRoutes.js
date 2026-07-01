const express = require("express");

const router = express.Router();

const {
  addFee,
  getFees,
  updateFeeStatus,
  deleteFee
} = require("../controllers/feeController");

router.post("/", addFee);

router.get("/", getFees);

router.put("/:id", updateFeeStatus);

router.delete("/:id", deleteFee);

module.exports = router;