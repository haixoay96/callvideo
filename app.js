var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var handleIo = require('./handleSocket/io.js').handleIo;

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
handleIo(io);
