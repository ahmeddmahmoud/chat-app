const WebSocket = require("ws");
const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);
const wsServer = new WebSocket.Server({ server });

let idCount = 0;
const users = [];

wsServer.on("connection", function (socket) {
  socket.id = idCount++; 
  users.push(socket);

  socket.on("message", function (msg) {
    const data = JSON.parse(msg);

    if (data.login) {
      socket.name = data.name;
      sendToAll({ type: "login", name: data.name, users: getUsers() });
    } else {
      sendToAll({ type: "chat", msg: data.msg, users: getUsers() }, socket);
    }
  });

  socket.on("close", function () {
    users.splice(users.indexOf(socket), 1);
    sendToAll({ type: "logout", name: socket.name, users: getUsers() });
  });
});

function getUsers() {
  return users.map((user) => user.name);
}

function sendToAll(data, exclude) {
  users.forEach((user) => {
    if (user !== exclude) {
      user.send(JSON.stringify(data));
    }
  });
}

app.use(express.static("public"));

server.listen(8090, function () {
  console.log("I am listening ...");
});
