import http from "http";
import SocketIO from "socket.io";
//import WebSocket from "ws";
import express from "express";

const app = express();

app.set('view engine', "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log('Listening on http://localhost:3000');

//http 서버
const httpServer = http.createServer(app);
//socket.io 서버
const wsServer = SocketIO(httpServer);

//연결
wsServer.on("connection", (socket) => {
    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`);
    })
    //room 입장
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        done();
        //입장 알림
        socket.to(roomName).emit("welcome");
    });
    //퇴장 알림
    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => socket.to(room).emit("bye"));
    })
    //메시지 전송
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", msg);
        done();
    })
})

httpServer.listen(3000, handleListen);

// //웹소켓 서버
// const wss = new WebSocket.Server({ server });

// //연결 된 브라우저 확인용
// const sockets = [];

// //브라우저-서버 연결
// wss.on("connection", (socket) => {
//     sockets.push(socket);
//     socket["nickname"] = "Anon";
//     console.log("Connected to Browser ⭕");
//     //클라이언트 측에서 종료 시 이벤트
//     socket.on("close", ()=> console.log("Disconnected from Browser ❌"))
//     //클라이언트 측 전송 메시지 출력
//     socket.on("message", (msg) => {
//         //연결 된 모든 브라우저에 전송
//         const message = JSON.parse(msg);
//         switch (message.type) {
//             case "new_message":
//                 sockets.forEach(aSocket => 
//                     aSocket.send(`${socket.nickname}: ${message.payload}`));
//             case "nickname":
//                 socket["nickname"] = message.payload;
//         }
//     });
// })
