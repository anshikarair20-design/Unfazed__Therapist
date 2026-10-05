import { useState } from "react";

function Availability() {
    const [formData, setFormData] = useState({
        day: "Monday",
        startTime: "",
        endTime: ""
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
            const token = localStorage.getItem("token");

            const response = await fetch(
                "https://unfazed-backend-xnph.onrender.com/api/availability",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to add availability"
                );
            }

            setMessage("Availability added successfully.");

        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div style={{ padding: "40px" }}>
            <h1>Therapist Availability</h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Day</label>
                    <br />

                    <select
                        name="day"
                        value={formData.day}
                        onChange={handleChange}
                    >
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                    </select>
                </div>

                <br />

                <div>
                    <label>Start Time</label>
                    <br />

                    <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>End Time</label>
                    <br />

                    <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        required
                    />
                </div>

                <br />

                <button type="submit">
                    Add Availability
                </button>

            </form>

            {message && (
                <p>{message}</p>
            )}
        </div>
    );
}

export default Availability;