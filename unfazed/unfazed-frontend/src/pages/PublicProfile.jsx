import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function PublicProfile() {
    const { slug } = useParams();

    const [therapist, setTherapist] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const getPublicProfile = async () => {
            try {
                const response = await axios.get(
                    `https://unfazed-backend-xnph.onrender.com/api/therapists/${slug}`
                );

                setTherapist(response.data.therapist);

            } catch (error) {
                setMessage(
                    error.response?.data?.message ||
                    "Profile not found"
                );
            }
        };

        getPublicProfile();
    }, [slug]);

    return (
        <div>
            <h1>Unfazed</h1>

            {message && <p>{message}</p>}

            {therapist && (
                <div>
                    <h2>{therapist.name}</h2>

                    <p>
                        Specialization: {therapist.specialization}
                    </p>

                    <p>
                        Bio: {therapist.bio}
                    </p>
                </div>
            )}
        </div>
    );
}

export default PublicProfile;