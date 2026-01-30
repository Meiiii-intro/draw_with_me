const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static("Public"));

io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  socket.on("drawing", (data) => {
    socket.broadcast.emit("drawing", data); 
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("Server running at http://localhost:" + PORT);
});
