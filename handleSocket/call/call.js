var handleCall = (socket, redisClient) => {
    socket.on('call', (data) => {
        var name = data.name;
        var codeCall = data.codeCall;
        if (socket.name) {
            redisClient.sismember('list', name, (err, rely) => {
                if (err) {
                    console.log('Error system '+__dirname);
                    socket.emit('errorCall', {
                        errorCode: 102
                    });
                    return;
                }
                if (rely === 0) {
                    console.log('Not found callee! ' + __dirname);
                    socket.emit('errorCall', {
                        errorCode: 103
                    });
                    return;
                }
                socket.broadcast.to(name).emit('waitForCaller', {
                    name: socket.name,
                    codeCall: data.codeCall
                });
            });
            return;
        }
        //been not login
        console.log(socket.id + ' been not login ' + __dirname);
        socket.emit('errorCall', {
            errorCode: 101
        });
    });
}
module.exports.handleCall = handleCall;
