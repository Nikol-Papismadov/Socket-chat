// const socket=io();

// socket.on("connect",()=>{
//     const username=prompt("Enter your username:");
//     socket.emit("join",username);
// });
// const messagesContainer=document.getElementById("messages");
// const messageInput=document.getElementById("messageInput");
// const sendButton=document.getElementById("sendButton");
// const getUsersButton=document.getElementById("getUsersButton");

// sendButton.addEventListener("click",()=>{
//     const message=messageInput.value;
//    if(message.trim()!==""){
//     socket.emit("ChatMessage",message);
//     messageInput.value="";
//    }
// });

// socket.on("message",({username,message})=>{
//     const messageElement=document.createElement("div");
//     messageElement.innerText=`${username}: ${message}`;
//     messagesContainer.appendChild(messageElement);
// });

// socket.on("userJoined",({username})=>{  
//     const joinMessageElement=document.createElement("div");
//     joinMessageElement.classList.add("join-message");
//     joinMessageElement.innerText=`${username} joined the chat`;
//     messagesContainer.appendChild(joinMessageElement);
// });

// socket.on("userLeft",({username})=>{
//     const leaveMessageElement=document.createElement("div");
//     leaveMessageElement.classList.add("leave-message"); 
//     leaveMessageElement.innerText=`${username} left the chat`;
//     messagesContainer.appendChild(leaveMessageElement);
// });

// getUsersButton.addEventListener("click",()=>{
//     socket.emit("getAllUsers");
// });

// socket.on("allUsers",({userList})=>{
//     const usersListString=userList.join(", ");
//     alert(`List of all users: ${usersListString}`);
// });
