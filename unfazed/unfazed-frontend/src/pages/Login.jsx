import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
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
                "https://unfazed-backend-xnph.onrender.com/api/therapists/login",
                formData
            );

            localStorage.setItem("token", response.data.token);

            setMessage("Login successful!");

            navigate("/dashboard");

        } catch (error) {
            setMessage(
                error.response?.data?.message || "Login failed"
            );
        }
    };

    return (
        <div>
            <h1>Unfazed</h1>

            <h2>Therapist Login</h2>

            <form onSubmit={handleSubmit}>

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

                <button type="submit">
                    Login
                </button>

            </form>

            {message && <p>{message}</p>}

            <p>
                Don't have an account?{" "}
                <Link to="/signup">
                    Create an account
                </Link>
            </p>
        </div>
    );
}

export default Login;