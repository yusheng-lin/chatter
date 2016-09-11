import http from 'http';
import express from 'express';
import socketio from 'socket.io';
import path from 'path';

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname,'public')));

io.on('connection',(client)=>{
  client.on('login',(name)=>{
    client.name = name;
    client.broadcast.emit('login',name);
  });
  client.on('message',(msg) =>{
    io.sockets.emit('message',client.name,msg);
  });
});

server.listen(8080);
