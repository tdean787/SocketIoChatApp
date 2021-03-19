const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const express = require("express");
// app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
app.use(express.static("../public"));
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("server started on port", port));

http.listen(3001, () => {
  console.log("listening on 3001");
});

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
