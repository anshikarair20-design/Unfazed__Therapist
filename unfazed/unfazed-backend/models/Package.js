const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
    {
        therapist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Therapist",
            required: true
        },

        name: {
            type: String,
            required: true
        },

        sessions: {
            type: Number,
            required: true,
            enum: [3, 6, 12]
        },

        pricePerSession: {
            type: Number,
            required: true
        },

        totalPrice: {
            type: Number,
            required: true
        },

        expiryDays: {
            type: Number,
            default: 90
        },

        active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Package", packageSchema);