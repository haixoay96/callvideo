var listUser = require('../../utils/listUser.js');
var _ = require('lodash');
var handleDisconnect = (socket) => {
    socket.on('disconnect', () => {
        if (socket.name) {
            var index = _.indexOf(listUser, socket.name);
            if(index!==-1){
                console.log('Remove '+ socket.name + ' successfull '+ __dirname);
                listUser.splice(index, 1);
            }
        }
        console.log(socket.id + ' disconnected! ' + __dirname);
        console.log(listUser);
    });
}
module.exports.handleDisconnect = handleDisconnect;
