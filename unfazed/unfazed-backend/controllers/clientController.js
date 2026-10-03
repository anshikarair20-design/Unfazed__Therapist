const Client = require("../models/Client");

const {
    canAccess
} = require("../services/entitlementService");

const createClient = async (req, res) => {
    try {
        // Check subscription entitlement
        const allowed = await canAccess(
            req.therapist.id,
            "maxClients"
        );

        if (!allowed) {
            return res.status(403).json({
                message:
                    "Client limit reached for your subscription tier. Please upgrade your plan."
            });
        }

        const {
            name,
            email,
            phone,
            notes
        } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                message: "Name and email are required"
            });
        }

        const existingClient = await Client.findOne({
            therapist: req.therapist.id,
            email
        });

        if (existingClient) {
            return res.status(400).json({
                message: "Client already exists"
            });
        }

        const client = await Client.create({
            therapist: req.therapist.id,
            name,
            email,
            phone,
            notes
        });

        res.status(201).json({
            message: "Client created successfully",
            client
        });

    } catch (error) {
        console.error("CLIENT ERROR:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const getClients = async (req, res) => {
    try {
        const clients = await Client.find({
            therapist: req.therapist.id
        }).select("-__v");

        res.json({
            clients
        });

    } catch (error) {
        console.error("GET CLIENTS ERROR:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const getClient = async (req, res) => {
    try {
        const client = await Client.findOne({
            _id: req.params.id,
            therapist: req.therapist.id
        }).select("-__v");

        if (!client) {
            return res.status(404).json({
                message: "Client not found"
            });
        }

        res.json({
            client
        });

    } catch (error) {
        console.error("GET CLIENT ERROR:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const updateIntake = async (req, res) => {
    try {
        const {
            age,
            gender,
            reasonForTherapy,
            goals,
            previousTherapy
        } = req.body;

        const client = await Client.findOne({
            _id: req.params.id,
            therapist: req.therapist.id
        });

        if (!client) {
            return res.status(404).json({
                message: "Client not found"
            });
        }

        client.intake = {
            age,
            gender,
            reasonForTherapy,
            goals,
            previousTherapy
        };

        await client.save();

        res.json({
            message: "Intake information saved successfully",
            client
        });

    } catch (error) {
        console.error("UPDATE INTAKE ERROR:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const giveConsent = async (req, res) => {
    try {
        const client = await Client.findOne({
            _id: req.params.id,
            therapist: req.therapist.id
        });

        if (!client) {
            return res.status(404).json({
                message: "Client not found"
            });
        }

        client.consent = {
            given: true,
            consentDate: new Date()
        };

        await client.save();

        res.json({
            message: "Consent recorded successfully",
            client
        });

    } catch (error) {
        console.error("CONSENT ERROR:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    createClient,
    getClients,
    getClient,
    updateIntake,
    giveConsent
};