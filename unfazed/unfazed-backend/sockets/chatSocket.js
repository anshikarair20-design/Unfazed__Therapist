function setupChatSocket(io) {

    io.on("connection", (socket) => {

        console.log("User connected:", socket.id);


        // JOIN CHAT ROOM
        socket.on("joinRoom", (roomId) => {

            socket.join(roomId);

            console.log(
                `Socket ${socket.id} joined room ${roomId}`
            );

        });


        // SEND MESSAGE
        socket.on("sendMessage", (data) => {

            const {
                roomId,
                sender,
                message
            } = data;

            if (!roomId || !sender || !message) {
                return;
            }


            const messageData = {
                sender,
                message,
                timestamp: new Date()
            };


            // SEND MESSAGE TO EVERYONE
            // IN THE SAME ROOM

            io.to(roomId).emit(
                "receiveMessage",
                messageData
            );

        });


        // DISCONNECT
        socket.on("disconnect", () => {

            console.log(
                "User disconnected:",
                socket.id
            );

        });

    });

}

module.exports = setupChatSocket;