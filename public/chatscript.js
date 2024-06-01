let name = prompt("Enter your name");
document.getElementById('title').innerText = `User: ${name}`;
let chat = document.getElementById('chat');
let msgInput = document.getElementById('msg');
let sendBtn = document.getElementById('send');
let clearBtn = document.getElementById('clear');
let usersList = document.getElementById('users');

let socket = new WebSocket('ws://localhost:8090');

socket.onopen = function() {
  socket.send(JSON.stringify({ login: true, name: name }));
};

socket.onmessage = function(event) {
  let data = JSON.parse(event.data);

  if (data.type === 'login') {
    chat.innerHTML += `<div class="d-flex justify-content-center"><p class="text-success chat-message">${data.name} joined</p></div>`;
  } else if (data.type === 'logout') {
    chat.innerHTML += `<div class="d-flex justify-content-center"><p class="text-danger chat-message">${data.name} left</p></div>`;
  } else if (data.type === 'chat') {
    chat.innerHTML += `<div class="d-flex justify-content-start"><p class="bg-light border rounded p-2 chat-message">${data.msg}</p></div>`;
  }

  usersList.innerHTML = '';
  data.users.forEach(user => {
    usersList.innerHTML += `<li class="list-group-item">${user}</li>`;
  });
};

sendBtn.addEventListener('click', function() {
  let msg = msgInput.value;
  socket.send(JSON.stringify({ msg: `${name}: ${msg}` }));
  chat.innerHTML += `<div class="d-flex justify-content-end"><p class="bg-primary text-white border rounded p-2 chat-message">Me: ${msg}</p></div>`;
  msgInput.value = '';
});

clearBtn.addEventListener('click', function() {
  chat.innerHTML = '';
});
