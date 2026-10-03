const express = require("express");

const {
    signup,
    login,
    getProfile,
    getPublicProfile
} = require("../controllers/therapistController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.get("/profile", authMiddleware, getProfile);

router.get("/:slug", getPublicProfile);

module.exports = router;