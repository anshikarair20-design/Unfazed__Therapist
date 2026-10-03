const express = require("express");

const {
    createPackage,
    getPackages
} = require("../controllers/packageController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createPackage);

router.get("/", authMiddleware, getPackages);

module.exports = router;