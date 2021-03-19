const app = require("express")();
const http = require("http").createServer(app);
const fs = require("fs").promises;
const io = require("socket.io")(http);
const express = require("express");

// const server = require("http").createServer();

const server = http.createServer(requestListener);

// app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
app.use(express.static("../public"));
const port = process.env.PORT || 3000;
// app.listen(port, () => console.log("server started on port", port));

server.listen(port, () => console.log(`listening on ${port}`));

const requestListener = function (req, res) {
  fs.readFile(__dirname, +"/index.html")
    .then((contents) => {
      res.setHeader("Content-Type", "text/html");
      res.writeHead(200);
      res.end(contents);
    })
    .catch((err) => {
      res.writeHead(500);
      res.end(err);
      return;
    });
};

let users = [];

io.on("connection", (socket) => {
  console.log("user connected");

  // socket.on("setUsername", (data) => {
  //   if (users.indexOf(data) > -1) {
  //     users.push(data);
  //     socket.emit("userSet", { username: data });
  //     console.log(data);
  //   } else {
  //     socket.emit(
  //       "userExists",
  //       data + " username is taken. Please try another."
  //     );
  //   }
  // });

  socket.on("setUsername", (data) => {
    console.log(data);
    users.push(data);
    socket.emit("userSet", { username: data });
  });

  socket.on("msg", (data) => {
    io.emit("newmsg", data);
  });

  socket.on("typing", (data) => {
    // console.log("typing registered");
    socket.emit("typing", data);
  });

  socket.on("chat message", (data) => {
    console.log("message: " + data.messageBody);
  });

  // io.on("connection", (socket) => {
  socket.on("chat message", (data) => {
    io.emit("chat message", data);
  });
  // });
});
