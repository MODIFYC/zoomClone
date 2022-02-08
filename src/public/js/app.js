//연결
const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

//room 숨기기
room.hidden = true;

let roomName;

//메시지 생성
function addMessage(message){
    const ul = room.querySelector('ul');
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

//메시지 전송
function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("input");
    const value=  input.value;
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}

//room 보이기
function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const form = room.querySelector("form");
    form.addEventListener("submit", handleMessageSubmit);
}

//room 입장
function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

//입장 알림
socket.on("welcome", ()=>{
    addMessage("Someone Joined!")
});

//퇴장 알림
socket.on("bye", ()=>{
    addMessage("Someone left!")
});

//메시지 표시
socket.on("new_message", addMessage);