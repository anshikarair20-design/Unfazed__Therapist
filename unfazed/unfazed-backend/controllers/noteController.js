const SessionNote = require("../models/SessionNote");
const Client = require("../models/Client");

const {
    canAccess
} = require("../services/entitlementService");


// CREATE NOTE
const createNote = async (req, res) => {
    try {
        const {
            clientId,
            content,
            visibility
        } = req.body;

        if (!clientId || !content) {
            return res.status(400).json({
                message: "Client and note content are required"
            });
        }

        // Make sure the client belongs to this therapist
        const client = await Client.findOne({
            _id: clientId,
            therapist: req.therapist.id
        });

        if (!client) {
            return res.status(404).json({
                message: "Client not found"
            });
        }

        const noteVisibility =
            visibility === "shared"
                ? "shared"
                : "private";


        // Shared/advanced notes require the advanced notes feature
        if (noteVisibility === "shared") {

            const allowed = await canAccess(
                req.therapist.id,
                "advancedNotes"
            );

            if (!allowed) {
                return res.status(403).json({
                    message:
                        "Shared notes are available on Pro and Premium plans. Please upgrade your subscription."
                });
            }
        }


        const sessionNote = await SessionNote.create({
            therapist: req.therapist.id,
            client: clientId,
            content,
            visibility: noteVisibility
        });


        res.status(201).json({
            message: "Note created successfully",
            note: sessionNote
        });

    } catch (error) {

        console.error(
            "CREATE NOTE ERROR:",
            error
        );

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// GET THERAPIST NOTES
const getTherapistNotes = async (req, res) => {
    try {

        const notes = await SessionNote.find({
            therapist: req.therapist.id
        })
            .populate(
                "client",
                "name email"
            )
            .sort({
                createdAt: -1
            });


        res.json({
            notes
        });

    } catch (error) {

        console.error(
            "GET THERAPIST NOTES ERROR:",
            error
        );

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// GET CLIENT SHARED NOTES
const getClientSharedNotes = async (req, res) => {
    try {

        const notes = await SessionNote.find({
            client: req.params.clientId,
            visibility: "shared"
        })
            .select(
                "content visibility createdAt"
            )
            .sort({
                createdAt: -1
            });


        res.json({
            notes
        });

    } catch (error) {

        console.error(
            "GET SHARED NOTES ERROR:",
            error
        );

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    createNote,
    getTherapistNotes,
    getClientSharedNotes
};