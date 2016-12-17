var listUser = require('../../utils/listUser.js');
var _ = require('lodash');
var handleCall = (socket) => {
    socket.on('call', (data) => {
        var name = data.name;
        var codeCall = data.codeCall;
        if (socket.name) {
            var index = _.indexOf(listUser, name);
            if (index !== -1) {
                console.log(socket.name + ' calling to ' + name);
                socket.broadcast.to(name).emit('waitForCaller', {
                    name: socket.name,
                    codeCall: data.codeCall
                });
                return;
            }
            console.log('Not found callee! ' + __dirname);
            socket.emit('resultCall', {
                status: 101
            });
        }
    });
}
module.exports.handleCall = handleCall;
