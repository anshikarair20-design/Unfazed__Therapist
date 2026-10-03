const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        therapist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Therapist",
            required: true
        },

        clientName: {
            type: String,
            required: true
        },

        clientEmail: {
            type: String,
            required: true
        },

        date: {
            type: String,
            required: true
        },

        startTime: {
            type: String,
            required: true
        },

        duration: {
            type: Number,
            required: true
        },

        timezone: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: [
                "booked",
                "cancelled",
                "completed",
                "no-show"
            ],
            default: "booked"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Booking",
    bookingSchema
);