import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Clients() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch("http://localhost:5000/api/clients", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to load clients");
                }

                return res.json();
            })
            .then((data) => {
                setClients(data.clients || []);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [token]);

    if (loading) {
        return <h2>Loading clients...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div style={{ padding: "40px" }}>
            <h1>My Clients</h1>

            {clients.length === 0 ? (
                <p>No clients found.</p>
            ) : (
                <div>
                    {clients.map((client) => (
                        <div
                            key={client._id}
                            onClick={() =>
                                navigate(`/clients/${client._id}`)
                            }
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "10px",
                                padding: "20px",
                                marginBottom: "15px",
                                cursor: "pointer",
                            }}
                        >
                            <h2>{client.name}</h2>

                            <p>
                                Email: {client.email}
                            </p>

                            <p>
                                Phone:{" "}
                                {client.phone || "Not provided"}
                            </p>

                            <p>
                                Notes:{" "}
                                {client.notes || "No notes"}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Clients;