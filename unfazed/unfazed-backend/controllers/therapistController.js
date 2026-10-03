const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Therapist = require("../models/Therapist");

const signup = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            specialization,
            bio
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        const existingTherapist = await Therapist.findOne({ email });

        if (existingTherapist) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const slug = name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        const therapist = await Therapist.create({
            name,
            email,
            password: hashedPassword,
            slug,
            specialization,
            bio
        });

        res.status(201).json({
            message: "Therapist registered successfully",
            therapist: {
                id: therapist._id,
                name: therapist.name,
                email: therapist.email,
                slug: therapist.slug,
                specialization: therapist.specialization,
                bio: therapist.bio
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const therapist = await Therapist.findOne({ email });

        if (!therapist) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            therapist.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: therapist._id,
                email: therapist.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            message: "Login successful",
            token,
            therapist: {
                id: therapist._id,
                name: therapist.name,
                email: therapist.email,
                slug: therapist.slug
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


const getProfile = async (req, res) => {
    try {
        const therapist = await Therapist.findById(req.therapist.id)
            .select("-password");

        if (!therapist) {
            return res.status(404).json({
                message: "Therapist not found"
            });
        }

        res.json({
            therapist
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


const getPublicProfile = async (req, res) => {
    try {
        const therapist = await Therapist.findOne({
            slug: req.params.slug
        }).select("-password -email");

        if (!therapist) {
            return res.status(404).json({
                message: "Therapist not found"
            });
        }

        res.json({
            therapist
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    };
};
module.exports = {
    signup,
    login,
    getProfile,
    getPublicProfile
};