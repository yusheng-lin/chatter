const socket = io.connect('http://localhost:8080');

const divChats = $('#divChats')
      ,txbChat = $('#txbChat');

$('form').on('submit',(e)=>{
  e.preventDefault();
  socket.emit('message',txbChat.val());
  txbChat.val('');
});

socket.on('connect',()=>{
  socket.emit('login',prompt('who you are'));
});

socket.on('login',(chatter)=>{
  divChats.append($(`<p>${chatter} enter</p>`));
});

socket.on('message',(name,msg)=>{
  divChats.append($(`<p>${name}:${msg}</p>`));
});
