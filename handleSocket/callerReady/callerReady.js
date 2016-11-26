var handleCallerReady = (socket, name) => {
    socket.once('callerReady', (data) => {
        if (socket.name) {
            var name = data.name;
            var codeCall = data.codeCall;
            socket.broadcast.to(name).emit('callerReady', {
                name: socket.name,
                codeCall: codeCall
            });
            return;
        }
        console.log(socket.id + ' been not login! ' + __dirname);
    });
}
module.exports.handleCallerReady = handleCallerReady;
