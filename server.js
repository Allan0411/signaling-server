const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  // Send user ID to frontend
  socket.emit("yourID", socket.id);

  // Handle joining a room
  socket.on("join", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  // Handle call initiation
  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("hey", {
      from: data.from,
      signal: data.signalData
    });
  });

  // Handle answering the call
  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
