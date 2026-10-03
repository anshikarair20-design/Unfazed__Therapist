import { useState } from "react";
import axios from "axios";

function Signup() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        specialization: "",
        bio: ""
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:5000/api/therapists/signup",
                formData
            );

            setMessage(response.data.message);

            setFormData({
                name: "",
                email: "",
                password: "",
                specialization: "",
                bio: ""
            });

        } catch (error) {
            console.error("SIGNUP ERROR:", error);

            res.status(500).json({
                message: "Server error",
                error: error.message
            });
        }
    }
    return (
        <div>
            <h1>Unfazed</h1>

            <h2>Therapist Signup</h2>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="specialization"
                    placeholder="Specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                />

                <textarea
                    name="bio"
                    placeholder="Professional Bio"
                    value={formData.bio}
                    onChange={handleChange}
                />

                <button type="submit">
                    Create Account
                </button>

            </form>

            {message && <p>{message}</p>}
        </div>
    );
}

export default Signup;