const Availability = require("../models/Availability");

const addAvailability = async (req, res) => {
    try {
        const {
            day,
            startTime,
            endTime
        } = req.body;

        if (!day || !startTime || !endTime) {
            return res.status(400).json({
                message: "Day, start time and end time are required"
            });
        }

        const availability = await Availability.create({
            therapist: req.therapist.id,
            day,
            startTime,
            endTime
        });

        res.status(201).json({
            message: "Availability added successfully",
            availability
        });

    } catch (error) {
        console.error("AVAILABILITY ERROR:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    addAvailability
};