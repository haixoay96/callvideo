var handleDisconnect = (socket, redisClient) => {
    socket.on('disconnect', () => {
        console.log(socket.name);
        if (socket.name) {
            redisClient.srem('list', socket.name, (err, rely) => {
                if (err) {
                    console.log('Remove err ' + __dirname);
                    return;
                }
                if (rely === 0) {
                    console.log('Not found ' + socket.name + '! ' + __dirname);
                }
                console.log('Remove successfull!');
            });
        }
        console.log(socket.id + ' disconnected! ' + __dirname);
    });
}
module.exports.handleDisconnect = handleDisconnect;
