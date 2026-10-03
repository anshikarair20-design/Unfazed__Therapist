import { useEffect, useState } from "react";

function Notes() {
    const [notes, setNotes] = useState([]);

    const [formData, setFormData] = useState({
        clientId: "",
        content: "",
        visibility: "private"
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");


    // LOAD NOTES
    const loadNotes = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/notes",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load notes"
                );
            }

            setNotes(data.notes || []);

        } catch (error) {
            setMessage(error.message);
        }
    };


    useEffect(() => {
        loadNotes();
    }, []);


    // HANDLE INPUT
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    // CREATE NOTE
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.clientId || !formData.content) {
            setMessage(
                "Client ID and note content are required."
            );
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const response = await fetch(
                "http://localhost:5000/api/notes",
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
                    data.message || "Failed to create note"
                );
            }

            setMessage(
                "Session note created successfully."
            );

            setFormData({
                clientId: "",
                content: "",
                visibility: "private"
            });

            loadNotes();

        } catch (error) {
            setMessage(error.message);

        } finally {
            setLoading(false);
        }
    };


    return (
        <div
            style={{
                padding: "40px",
                maxWidth: "900px"
            }}
        >

            <h1>Clinical Session Notes</h1>

            <p>
                Create and manage private or shared session notes.
            </p>

            <hr />


            {/* CREATE NOTE */}

            <h2>Create Session Note</h2>

            <form onSubmit={handleSubmit}>

                <div style={{ marginBottom: "15px" }}>

                    <label>
                        Client ID
                    </label>

                    <br />

                    <input
                        type="text"
                        name="clientId"
                        value={formData.clientId}
                        onChange={handleChange}
                        placeholder="Enter client ID"
                        required
                    />

                </div>


                <div style={{ marginBottom: "15px" }}>

                    <label>
                        Note Content
                    </label>

                    <br />

                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="Write session notes..."
                        rows="8"
                        style={{
                            width: "100%",
                            maxWidth: "700px"
                        }}
                        required
                    />

                </div>


                <div style={{ marginBottom: "15px" }}>

                    <label>
                        Visibility
                    </label>

                    <br />

                    <select
                        name="visibility"
                        value={formData.visibility}
                        onChange={handleChange}
                    >

                        <option value="private">
                            Private
                        </option>

                        <option value="shared">
                            Shared with Client
                        </option>

                    </select>

                </div>


                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Saving..."
                        : "Save Session Note"}
                </button>

            </form>


            {message && (
                <p style={{ marginTop: "20px" }}>
                    {message}
                </p>
            )}


            <hr />


            {/* EXISTING NOTES */}

            <h2>Existing Notes</h2>

            {notes.length === 0 ? (

                <p>
                    No session notes created yet.
                </p>

            ) : (

                notes.map((note) => (

                    <div
                        key={note._id}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "10px",
                            padding: "20px",
                            marginBottom: "15px"
                        }}
                    >

                        <p>
                            <strong>
                                Client:
                            </strong>{" "}
                            {note.client}
                        </p>

                        <p>
                            <strong>
                                Visibility:
                            </strong>{" "}
                            {note.visibility}
                        </p>

                        <p>
                            <strong>
                                Note:
                            </strong>
                        </p>

                        <p>
                            {note.content}
                        </p>

                        <p
                            style={{
                                fontSize: "13px",
                                color: "#666"
                            }}
                        >
                            Created:{" "}
                            {new Date(
                                note.createdAt
                            ).toLocaleString()}
                        </p>

                    </div>

                ))

            )}

        </div>
    );
}

export default Notes;