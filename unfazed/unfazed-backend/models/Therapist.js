const mongoose = require("mongoose");

const therapistSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        specialization: {
            type: String,
            default: ""
        },

        bio: {
            type: String,
            default: ""
        },

        subscriptionTier: {
            type: String,
            default: "Basic"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Therapist", therapistSchema);