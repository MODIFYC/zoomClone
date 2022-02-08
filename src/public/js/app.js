const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`);

//서버로 연결
socket.addEventListener("open", () => {
    console.log("Connected to Server ⭕");
})

//object -> String 변환
function makeMessage(type, payload){
    const msg = { type, payload };
    return JSON.stringify(msg);
}

//수신 메세지 표시
socket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
})

//연결 끊김
socket.addEventListener("close", () =>{
    console.log("Disconnected from Server ❌");
})

//서버로 메시지 내용 전송
function handleSubmit(event){
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("new_message", input.value));
    input.value = "";
}

//닉네임 정보
function handleNickSubmit(event){
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
    input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);