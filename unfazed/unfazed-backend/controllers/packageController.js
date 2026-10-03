const Package = require("../models/Package");

// CREATE PACKAGE
const createPackage = async (req, res) => {
    try {
        const {
            name,
            sessions,
            pricePerSession,
            expiryDays
        } = req.body;

        if (!name || !sessions || !pricePerSession) {
            return res.status(400).json({
                message: "Name, sessions and price per session are required"
            });
        }

        if (![3, 6, 12].includes(Number(sessions))) {
            return res.status(400).json({
                message: "Sessions must be 3, 6 or 12"
            });
        }

        const totalPrice =
            Number(sessions) * Number(pricePerSession);

        const packageData = await Package.create({
            therapist: req.therapist.id,
            name,
            sessions: Number(sessions),
            pricePerSession: Number(pricePerSession),
            totalPrice,
            expiryDays: expiryDays || 90
        });

        res.status(201).json({
            message: "Package created successfully",
            package: packageData
        });

    } catch (error) {
        console.error("CREATE PACKAGE ERROR:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// GET ALL PACKAGES
const getPackages = async (req, res) => {
    try {
        const packages = await Package.find({
            therapist: req.therapist.id,
            active: true
        }).sort({ sessions: 1 });

        res.json({
            packages
        });

    } catch (error) {
        console.error("GET PACKAGES ERROR:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    createPackage,
    getPackages
};