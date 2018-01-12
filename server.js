var express = require('express');
var app = express();
var _dirname="C:/Users/mukul/Desktop/project/Pchat";
var server = require('http').createServer(app);
var io = require('socket.io').listen(server)
nicknames=[];

server.listen(process.env.PORT || 3000);
console.log('server running...');
app.get('/',function(req,res){
	res.sendFile(_dirname + '/index.html');
});

io.sockets.on('connection',function(socket)
{
	socket.on('new user',function(data, callback)
	{
		if(nicknames.indexOf(data)!=-1)
		{
			callback(false);
		}
		else
		{   
			callback(true);
			socket.nickname=data;
			nicknames.push(socket.nickname);
			updateNicknames();
		}

	});
		function updateNicknames()
		{
			io.sockets.emit('usernames',nicknames);
		}

   socket.on('send message',function(data)
   {
   	io.sockets.emit('new message',{msg: data,nick: socket.nickname});
   });

   socket.on('disconnect',function(data)
   {
   		if(!socket.nickname) return;
   		nicknames.splice(nicknames.indexOf(socket.nickname),1);
   		updateNicknames();
   });
});
