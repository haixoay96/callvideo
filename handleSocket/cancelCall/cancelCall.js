var handleCancelCall = (socket) => {
    socket.on('cancelCall', (data) => {
        var name = data.name;
        var codeCall = data.codeCall;
        if (socket.name) {
            socket.broadcast.to(name).emit('on_cancel', {
                codeCall: codeCall,
                name: socket.name
            });
        }
    });
}
module.exports.handleCancelCall = handleCancelCall;
