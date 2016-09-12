import http from 'http';
import express from 'express';
import socketio from 'socket.io';
import path from 'path';
import redis from 'redis';

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const dbClient = redis.createClient();

const saveMessage = function(name,message){
  const payload = JSON.stringify({name, message});
  dbClient.lpush('messages',payload,function(err,res){
    dbClient.ltrim('messages',0,9);
  });
};

app.use(express.static(path.join(__dirname,'public')));

io.on('connection',(client)=>{
  client.on('login',(name)=>{
    client.name = name;
    dbClient.lrange('messages',0,-1,function(err,messages){
      messages.reverse().forEach(function(each){
        const { message,name } = JSON.parse(each);
        client.emit('message',name,message);
      });
    });
    client.broadcast.emit('login',name);
  });

  client.on('message',(msg) =>{
    saveMessage(client.name,msg);
    io.sockets.emit('message',client.name,msg);
  });
});

server.listen(8080);
