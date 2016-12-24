var handleLogin = require('./login/login.js').handleLogin;
var handleCall = require('./call/call.js').handleCall;
var handleCalleeReady = require('./calleeReady/calleeReady').handleCalleeReady;
var handleCallerReady = require('./callerReady/callerReady').handleCallerReady;
var handleMessage = require('./message/message.js').handleMessage;
var handleDisconnect = require('./disconnect/disconnect.js').handleDisconnect;
var handleRely = require('./rely/rely.js').handleRely;
var handleCancelCall = require('./cancelCall/cancelCall.js').handleCancelCall;
var handleIo = (io) => {
    io.on('connection', (socket) => {
        console.log(socket.id + ' connected');
        handleLogin(socket);
        handleCall(socket);
        handleCancelCall(socket);
        handleDisconnect(socket);
        handleRely(socket);
        handleMessage(socket);
        handleCallerReady(socket);
        handleCalleeReady(socket);

    });
}
module.exports.handleIo = handleIo;
