import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set('view engine', "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

//http 서버
const httpServer = http.createServer(app);
//socket.io 서버
const wsServer = SocketIO(httpServer);

//연결
wsServer.on("connection", (socket) => {
    //입장
    socket.on("join_room", (roomName) => {
      socket.join(roomName);
      socket.to(roomName).emit("welcome");
    });
    //피어 연결
    socket.on("offer", (offer, roomName) => {
        socket.to(roomName).emit("offer", offer);
      });
    //피어 연결 알림
    socket.on("answer", (answer, roomName) => {
        socket.to(roomName).emit("answer", answer);
    });
    socket.on("ice", (ice, roomName) => {
    socket.to(roomName).emit("ice", ice);
    });
  });  

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);