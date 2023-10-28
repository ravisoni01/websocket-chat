const express = require("express");
const app = express();

const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const PORT = 5000;

app.get("/", (req, res) => {
  res.send("Hello from server");
});

io.on("connection", (socket) => {
  console.log("connected!");

  socket.on("send_message", (message) => {
    io.sockets.emit("receive_message", message);
  });
});

server.listen(PORT, () => console.log(`server listening on port ${PORT}`));
