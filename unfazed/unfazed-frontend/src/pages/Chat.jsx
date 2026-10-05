import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://unfazed-backend-xnph.onrender.com");

function Chat() {
    const [roomId, setRoomId] = useState("");
    const [sender, setSender] = useState("");
    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState([]);

    const [joined, setJoined] = useState(false);


    // RECEIVE MESSAGES
    useEffect(() => {

        socket.on("receiveMessage", (data) => {

            setMessages((previousMessages) => [
                ...previousMessages,
                data
            ]);

        });


        return () => {
            socket.off("receiveMessage");
        };

    }, []);


    // JOIN ROOM
    const joinRoom = () => {

        if (!roomId || !sender) {
            alert("Enter room ID and your name.");
            return;
        }

        socket.emit("joinRoom", roomId);

        setJoined(true);

    };


    // SEND MESSAGE
    const sendMessage = () => {

        if (!message.trim()) {
            return;
        }

        socket.emit("sendMessage", {
            roomId,
            sender,
            message
        });

        setMessage("");

    };


    return (
        <div
            style={{
                padding: "40px",
                maxWidth: "800px"
            }}
        >

            <h1>Unfazed Chat</h1>

            {!joined ? (

                <div>

                    <h2>Join Chat</h2>

                    <div style={{ marginBottom: "15px" }}>

                        <label>
                            Room ID
                        </label>

                        <br />

                        <input
                            type="text"
                            value={roomId}
                            onChange={(e) =>
                                setRoomId(e.target.value)
                            }
                            placeholder="e.g. client123"
                        />

                    </div>


                    <div style={{ marginBottom: "15px" }}>

                        <label>
                            Your Name
                        </label>

                        <br />

                        <input
                            type="text"
                            value={sender}
                            onChange={(e) =>
                                setSender(e.target.value)
                            }
                            placeholder="Therapist"
                        />

                    </div>


                    <button onClick={joinRoom}>
                        Join Chat
                    </button>

                </div>

            ) : (

                <div>

                    <h2>
                        Chat Room: {roomId}
                    </h2>

                    <p>
                        Logged in as: <strong>{sender}</strong>
                    </p>


                    <div
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "10px",
                            padding: "20px",
                            minHeight: "300px",
                            marginBottom: "20px",
                            overflowY: "auto"
                        }}
                    >

                        {messages.length === 0 ? (

                            <p>
                                No messages yet.
                            </p>

                        ) : (

                            messages.map((msg, index) => (

                                <div
                                    key={index}
                                    style={{
                                        marginBottom: "15px"
                                    }}
                                >

                                    <strong>
                                        {msg.sender}
                                    </strong>

                                    <p>
                                        {msg.message}
                                    </p>

                                    <small>
                                        {new Date(
                                            msg.timestamp
                                        ).toLocaleTimeString()}
                                    </small>

                                </div>

                            ))

                        )}

                    </div>


                    <div>

                        <input
                            type="text"
                            value={message}
                            onChange={(e) =>
                                setMessage(e.target.value)
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    sendMessage();
                                }
                            }}
                            placeholder="Type a message..."
                            style={{
                                width: "70%",
                                marginRight: "10px"
                            }}
                        />

                        <button onClick={sendMessage}>
                            Send
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Chat;