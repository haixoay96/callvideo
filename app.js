var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var redis = require("redis");
var redisClient = redis.createClient();

redisClient.on("error", function (err) {
    console.log("Error " + err);
    process.exit(0);
});

server.listen(process.env.PORT || 3000, () => {
    console.log('Server running at port 3000!');
});
app.use('/', express.static(__dirname + '/public'));
app.use('/', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/', express.static(__dirname + '/node_modules/webrtc-adapter'));
app.use('/', express.static(__dirname + '/node_modules/detectrtc'));
app.use('/', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
var list = [];
var _ = require('lodash');
io.on('connection', (socket) => {
    console.log('There\'s person connect!');
    socket.on('login', (data) => {
        var name = data.name;
        redisClient.sadd('list', (err, reply)=>{
            if(err){
                console.log('Insert err!');
                socket.emit('resultLogin', {
                    status: 101
                });
                return;
            }
            console.log('Insert successfull! '+ reply);
            socket.emit('resultLogin', {
                status: 100
            });
            socket.join(name);
            console.log(name);
        });
    });
    socket.on('call', (data) => {
        var name = data.name;
        redisClient.sismember('list', (err, rely)=>{
            if(err){
                console.log('Check error!');
                
            }
        });
        var index = _.findIndex(list, {
            socket: socket.id
        });
        if (index === -1) {
            return;
        }
        socket.broadcast.to(data.name).emit('waitForCaller', {
            name: list[index].name
        });
        socket.once('callerReady', () => {
            socket.broadcast.to(data.name).emit('callerReady');
        });
        console.log(data.name + ' ' + list[index].name);
    });
    socket.on('rely', (data) => {
        socket.once('calleeReady', () => {
            socket.broadcast.to(data.name).emit('calleeReady');
        });
        socket.broadcast.to(data.name).emit('resultCall', {
            answer: data.answer
        });
    });
    socket.on('message', (data) => {
        var index = _.findIndex(list, {
            socket: socket.id
        });
        if (index === -1) {
            return;
        }
        var to = data.to;
        delete data.to;
        data.from = list[index].name;
        socket.broadcast.to(to).emit('on_receive_message', data);
    });
    socket.on('disconnect', () => {
        var index = _.findIndex(list, {
            socket: socket.id
        });
        if (index === -1) {
            return;
        }
        list.splice(index, 1);
        console.log(list);
    });
});