const { Server } = require("socket.io");

const io = new Server(4000, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // 1. Join a room based on the UNIQUE Order ID
    socket.on("join_order_chat", (orderId) => {
        const roomName = `order_${orderId}`; // Unique vault for this specific order
        socket.join(roomName);
        console.log(`User joined private order room: ${roomName}`);
    });

    // 2. Send message ONLY to that specific order room
    socket.on("send_message", (data) => {
        const roomName = `order_${data.orderId}`;
        // .to(roomName) ensures only the customer and tailor of this order see the text
        socket.to(roomName).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

console.log("Socket.io server running on port 4000");