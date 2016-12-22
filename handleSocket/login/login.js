var listUser = require('../../utils/listUser.js');
var _ = require('lodash');
var handleLogin = (socket) => {
    socket.on('login', (data, fn) => {
        if (socket.name) {
            console.log('Socket already login! ' + __dirname);
            socket.emit('resultLogin', {
                status: 102
            });
            return;
        }
        var name = data.name;
        var index = _.indexOf(listUser, name);
        if (index === -1) {
            console.log(name + ' login successfull! ' + __dirname);
            listUser.push(name);
            socket.name = name;
            socket.join(name);
            fn({
                status: 100
            });
            /*socket.emit('resultLogin', {
                status: 100
            });*/
            return;
        }
        console.log(name + ' have logined! ' + __dirname);
        fn({
            status: 101
        });
        /*socket.emit('resultLogin', {
            status: 101
        });*/
    });
}
module.exports.handleLogin = handleLogin;
