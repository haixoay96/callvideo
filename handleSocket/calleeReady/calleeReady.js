var handleCalleeReady = (socket) => {
    socket.on('calleeReady', (data) => {
        if (socket.name) {
            var name = data.name;
            var codeCall = data.codeCall;
            socket.broadcast.to(name).emit('calleeReady', {
                name: socket.name,
                codeCall: codeCall
            });
            return;
        }
        console.log(socket.id + ' been not login! ' + __dirname);
    });
}
module.exports.handleCalleeReady = handleCalleeReady;
