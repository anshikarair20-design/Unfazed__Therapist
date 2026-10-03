require("dotenv").config();

const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const setupChatSocket = require("./sockets/chatSocket");

setupChatSocket(io);


const startServer = async () => {
    try {

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log("MongoDB connected");

        server.listen(PORT, () => {
            console.log(
                `Unfazed backend running on port ${PORT}`
            );
        });

    } catch (error) {

        console.error(
            "MongoDB connection failed:",
            error.message
        );

        process.exit(1);
    }
};


startServer();