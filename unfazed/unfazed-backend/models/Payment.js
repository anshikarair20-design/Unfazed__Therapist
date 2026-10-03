const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
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

        amount: {
            type: Number,
            required: true
        },

        // Razorpay order ID
        razorpayOrderId: {
            type: String,
            default: ""
        },

        // Razorpay payment ID
        gatewayTransactionId: {
            type: String,
            default: ""
        },

        platformFee: {
            type: Number,
            default: 0
        },

        netAmount: {
            type: Number,
            default: 0
        },

        status: {
            type: String,
            enum: [
                "pending",
                "successful",
                "failed"
            ],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Payment",
    paymentSchema
);