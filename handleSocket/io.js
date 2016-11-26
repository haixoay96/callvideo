var handleLogin = require('./login/login.js').handleLogin;
var handleCall = require('./call/call.js').handleCall;
var handleCalleeReady = require('./calleeReady/calleeReady').handleCalleeReady;
var handleCallerReady = require('./callerReady/callerReady').handleCallerReady;
var handleMessage = require('./message/message.js').handleMessage;
var handleDisconnect = require('./disconnect/disconnect.js').handleDisconnect;
var handleRely = require('./rely/rely.js').handleRely;
var handleIo = (io, redisClient) => {
    io.on('connection', (socket) => {
        handleLogin(socket, redisClient);
        handleCall(socket, redisClient);
        handleDisconnect(socket, redisClient);
        handleRely(socket);
        handleMessage(socket);
        handleCallerReady(socket);
        handleCalleeReady(socket);

    });
}
module.exports.handleIo = handleIo;
