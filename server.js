const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const cors = require("cors");
const helmet = require('helmet')

const chat = require("./models/chat");
const characters = require("./config/characters");
const logger = require('./middleware/logger');

const port = process.env.PORT || 8080;
const app = express();

const server = http.createServer(app);
const NEW_CHAT_MESSAGE_EVENT = "NewChatMessage";

const io = socketIo(server, {
  cors: {
    origin: '*',
  }
});

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json());
app.use(logger);
app.use(helmet());

let prevSessionChat = [];
let currSessionChat = [];
let isFirstClient = true;
let firstCLientSocketId = null;

app.get("/api/initiate-chat", async (req, res) => {
  const client = isFirstClient;

  prevSessionChat = await chat.retrieveChat();
  if (client) {
    res.json({ message: true, chat: [...prevSessionChat, ...currSessionChat], characterList: characters.CHARACTERLIST }).status(200);
  }
  else {
    res.json({ message: false, chat: [...prevSessionChat, ...currSessionChat] }).status(200);
  }

});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

io.on("connection", (socket) => {
  const { roomId } = socket.handshake.query;

  if (isFirstClient) {
    firstCLientSocketId = socket.id;
    isFirstClient = false;
  }
  socket.join(roomId);

  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    currSessionChat.push(data);
    io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
  });

  socket.on("disconnect", async () => {
    if (firstCLientSocketId === socket.id) {

      isFirstClient = true;
      await chat.saveChat(currSessionChat);
      currSessionChat = [];
    }
    socket.leave(roomId);
  });

});

server.listen(port, () => console.log(`Listening on port ${port}`));