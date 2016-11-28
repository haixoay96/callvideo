var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var redis = require("redis");
var redisClient = redis.createClient();
var _ = require('lodash');
var handleIo = require('./handleSocket/io.js').handleIo;
redisClient.del('list', (err, rely) => {
    console.log(err);
    console.log(rely);
});
redisClient.on('ready', () => {
    console.log('Redis is ready!');
});
redisClient.on('connect', () => {
    console.log('Redis connect!');
})
redisClient.on('reconnecting', () => {
    console.log('Redis is reconnecting!');
});
redisClient.on('end', () => {
    console.log('Redis end!');
});
redisClient.on("error", function(err) {
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
handleIo(io, redisClient);
