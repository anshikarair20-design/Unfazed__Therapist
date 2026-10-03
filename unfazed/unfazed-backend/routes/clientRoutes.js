const express = require("express");

const {
    createClient,
    getClients,
    getClient,
    updateIntake,
    giveConsent
} = require("../controllers/clientController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create client
router.post("/", authMiddleware, createClient);

// Get all clients
router.get("/", authMiddleware, getClients);

// Get single client
router.get("/:id", authMiddleware, getClient);

// Save intake information
router.put("/:id/intake", authMiddleware, updateIntake);

// Give consent
router.put("/:id/consent", authMiddleware, giveConsent);

module.exports = router;