var handleCallerReady = (socket) => {
    socket.on('callerReady', (data) => {
        console.log(data);
        if (socket.name) {
            console.log('callerReady');
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
