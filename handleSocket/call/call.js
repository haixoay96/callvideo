var listUser = require('../../utils/listUser.js');
var _ = require('lodash');
var handleCall = (socket) => {
    socket.on('call', (data) => {
        var name = data.name;
        var codeCall = data.codeCall;
        var video = data.video;
        if (socket.name) {
            var index = _.indexOf(listUser, name);
            if (index !== -1) {
                console.log(socket.name + ' calling to ' + name);
                socket.broadcast.to(name).emit('waitForCaller', {
                    name: socket.name,
                    video: video,
                    codeCall: codeCall
                });
                return;
            }
            console.log('Not found callee! ' + __dirname);
            socket.emit('resultCall', {
                status: 101,
                name: name,
                codeCall: codeCall
            });
        }
    });
}
module.exports.handleCall = handleCall;
