const Booking = require("../models/Booking");

const {
    bookingConfirmation
} = require("../services/notificationService");

const createBooking = async (req, res) => {
    try {
        const {
            clientName,
            clientEmail,
            date,
            startTime,
            duration,
            timezone
        } = req.body;


        // VALIDATE BOOKING DETAILS

        if (
            !clientName ||
            !clientEmail ||
            !date ||
            !startTime ||
            !duration ||
            !timezone
        ) {
            return res.status(400).json({
                message: "All booking details are required"
            });
        }


        // PREVENT PAST BOOKINGS

        const today =
            new Date().toISOString().split("T")[0];

        if (date < today) {
            return res.status(400).json({
                message: "Booking date cannot be in the past"
            });
        }


        // PREVENT DOUBLE BOOKING

        const existingBooking = await Booking.findOne({
            therapist: req.therapist.id,
            date,
            startTime,
            status: "booked"
        });

        if (existingBooking) {
            return res.status(400).json({
                message: "This time slot is already booked"
            });
        }


        // CREATE BOOKING

        const booking = await Booking.create({
            therapist: req.therapist.id,
            clientName,
            clientEmail,
            date,
            startTime,
            duration,
            timezone
        });


        // FIRE NOTIFICATION

        bookingConfirmation({
            clientName,
            clientEmail,
            date,
            startTime
        });


        // RESPONSE

        res.status(201).json({
            message: "Booking created successfully",
            booking
        });


    } catch (error) {

        console.error(
            "BOOKING ERROR:",
            error
        );

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};


module.exports = {
    createBooking
};