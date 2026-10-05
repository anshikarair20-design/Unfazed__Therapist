import { useState } from "react";
import axios from "axios";

function Booking() {
    const [formData, setFormData] = useState({
        clientName: "",
        clientEmail: "",
        date: "",
        startTime: "",
        duration: 60,
        timezone: "Asia/Kolkata"
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                setMessage("Please login first.");
                setLoading(false);
                return;
            }

            const response = await axios.post(
                "https://unfazed-backend-xnph.onrender.com/api/bookings",
                {
                    ...formData,
                    duration: Number(formData.duration)
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            setMessage(
                response.data.message || "Booking created successfully"
            );

            // Clear form after successful booking
            setFormData({
                clientName: "",
                clientEmail: "",
                date: "",
                startTime: "",
                duration: 60,
                timezone: "Asia/Kolkata"
            });

        } catch (error) {
            console.error("BOOKING ERROR:", error);

            setMessage(
                error.response?.data?.message ||
                "Booking failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Unfazed</h1>

            <h2>Book a Session</h2>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="clientName"
                    placeholder="Client Name"
                    value={formData.clientName}
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="clientEmail"
                    placeholder="Client Email"
                    value={formData.clientEmail}
                    onChange={handleChange}
                    required
                />

                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />

                <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                />

                <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                >
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                </select>

                <input
                    type="text"
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleChange}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Booking..." : "Book Session"}
                </button>

            </form>

            {message && (
                <p>
                    {message}
                </p>
            )}
        </div>
    );
}

export default Booking;