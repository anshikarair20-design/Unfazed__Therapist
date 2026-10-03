const express = require("express");

const {
    addAvailability
} = require("../controllers/availabilityController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, addAvailability);

module.exports = router;