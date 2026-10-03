const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
    {
        therapist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Therapist",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },

        phone: {
            type: String,
            default: ""
        },

        notes: {
            type: String,
            default: ""
        },

        // INTAKE INFORMATION
        intake: {
            age: {
                type: Number,
                default: null
            },

            gender: {
                type: String,
                default: ""
            },

            reasonForTherapy: {
                type: String,
                default: ""
            },

            goals: {
                type: String,
                default: ""
            },

            previousTherapy: {
                type: String,
                default: ""
            }
        },

        // CONSENT
        consent: {
            given: {
                type: Boolean,
                default: false
            },

            consentDate: {
                type: Date,
                default: null
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Client", clientSchema);