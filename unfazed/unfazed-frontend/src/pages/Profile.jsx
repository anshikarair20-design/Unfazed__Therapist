import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
    const [therapist, setTherapist] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const getProfile = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "http://localhost:5000/api/therapists/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setTherapist(response.data.therapist);

            } catch (error) {
                setMessage(
                    error.response?.data?.message || "Failed to load profile"
                );
            }
        };

        getProfile();
    }, []);

    return (
        <div>
            <h1>Therapist Profile</h1>

            {message && <p>{message}</p>}

            {therapist && (
                <div>
                    <p>Name: {therapist.name}</p>
                    <p>Email: {therapist.email}</p>
                    <p>Specialization: {therapist.specialization}</p>
                    <p>Bio: {therapist.bio}</p>
                    <p>Profile Slug: {therapist.slug}</p>
                </div>
            )}
        </div>
    );
}

export default Profile;