// routes/investments.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// Create a new investment request
router.post("/request", auth, (req, res) => {
  const { title, amount, description } = req.body;
  // Logic to save the investment request in the database
  res.status(201).send("Investment request created");
});

module.exports = router;
