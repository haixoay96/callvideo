var handleLogin = (socket, redisClient) => {
    socket.on('login', (data) => {
        if (socket.name) {
            console.log('Socket already login! ' + __dirname);
            socket.emit('resultLogin', {
                status: 103
            });
            return;
        }
        var name = data.name;
        redisClient.sadd('list', name, (err, reply) => {
            if (err) {
                // insert err
                console.log(name + ' Insert err, login failure! ' + __dirname);
                socket.emit('resultLogin', {
                    status: 101
                });
                return;
            }
            // name already login
            if (reply === 0) {
                socket.emit('resultLogin', {
                    status: 102
                });
                console.log(name + ' Logined! ' + __dirname);
                return;
            }
            // successfull
            console.log(name + ' Insert successfull, login successfull ' + __dirname);
            socket.name = name;
            socket.emit('resultLogin', {
                status: 100
            });
            socket.join(name);
        });
    });
}
module.exports.handleLogin = handleLogin;
