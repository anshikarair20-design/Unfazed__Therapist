const mongoose = require("mongoose");

const subscriptionTierConfigSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },

        features: {
            maxClients: {
                type: Number,
                default: 10
            },

            advancedNotes: {
                type: Boolean,
                default: false
            },

            analytics: {
                type: Boolean,
                default: false
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "SubscriptionTierConfig",
    subscriptionTierConfigSchema
);