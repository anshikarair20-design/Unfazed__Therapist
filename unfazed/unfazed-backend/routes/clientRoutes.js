const express = require("express");

const {
    createClient,
    getClients,
    getClient,
    updateIntake,
    giveConsent
} = require("../controllers/clientController");

const router = express.Router();

router.post("/", createClient);

router.get("/", getClients);

router.get("/:id", getClient);

router.put("/:id/intake", updateIntake);

router.put("/:id/consent", giveConsent);

module.exports = router;