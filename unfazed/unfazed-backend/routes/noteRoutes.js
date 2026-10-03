const express = require("express");

const {
    createNote,
    getTherapistNotes,
    getClientSharedNotes
} = require("../controllers/noteController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// CREATE SESSION NOTE
router.post(
    "/",
    authMiddleware,
    createNote
);


// GET THERAPIST NOTES
router.get(
    "/",
    authMiddleware,
    getTherapistNotes
);


// GET SHARED NOTES FOR CLIENT
router.get(
    "/client/:clientId/shared",
    authMiddleware,
    getClientSharedNotes
);


module.exports = router;