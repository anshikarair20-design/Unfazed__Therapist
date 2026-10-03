const Therapist = require("../models/Therapist");
const SubscriptionTierConfig = require("../models/SubscriptionTierConfig");
const Client = require("../models/Client");

const canAccess = async (therapistId, featureKey) => {
    try {
        const therapist = await Therapist.findById(therapistId);

        if (!therapist) {
            return false;
        }

        const tier = await SubscriptionTierConfig.findOne({
            name: therapist.subscriptionTier
        });

        if (!tier) {
            return false;
        }

        // Feature 1: Maximum active clients
        if (featureKey === "maxClients") {
            const clientCount = await Client.countDocuments({
                therapist: therapistId
            });

            return clientCount < tier.features.maxClients;
        }

        // Feature 2: Advanced clinical notes
        if (featureKey === "advancedNotes") {
            return tier.features.advancedNotes === true;
        }

        // Feature 3: Analytics dashboard
        if (featureKey === "analytics") {
            return tier.features.analytics === true;
        }

        return false;

    } catch (error) {
        console.error(
            "ENTITLEMENT ERROR:",
            error
        );

        return false;
    }
};

module.exports = {
    canAccess
};