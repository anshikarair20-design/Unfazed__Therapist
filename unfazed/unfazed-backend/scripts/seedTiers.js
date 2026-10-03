require("dotenv").config();

const mongoose = require("mongoose");

const SubscriptionTierConfig = require("../models/SubscriptionTierConfig");

const tiers = [
    {
        name: "Basic",

        features: {
            maxClients: 10,
            advancedNotes: false,
            analytics: false
        }
    },

    {
        name: "Pro",

        features: {
            maxClients: 50,
            advancedNotes: true,
            analytics: false
        }
    },

    {
        name: "Premium",

        features: {
            maxClients: 200,
            advancedNotes: true,
            analytics: true
        }
    }
];

const seedTiers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        for (const tier of tiers) {
            await SubscriptionTierConfig.findOneAndUpdate(
                { name: tier.name },
                tier,
                {
                    upsert: true,
                    new: true
                }
            );

            console.log(`${tier.name} tier created/updated`);
        }

        console.log("All subscription tiers seeded successfully");

        await mongoose.connection.close();

    } catch (error) {
        console.error("SEED ERROR:", error);

        await mongoose.connection.close();

        process.exit(1);
    }
};

seedTiers();