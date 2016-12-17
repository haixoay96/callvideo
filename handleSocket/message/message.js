var handleMessage = (socket) => {
    socket.on('message', (data) => {
        if (socket.name) {
            var name = data.name;
            var codeCall = data.codeCall;
            var type = data.type;
            var payload = data.payload;
            console.log(name + ' send ' + type + ' to ' + socket.name +' '+ __dirname);
            socket.broadcast.to(name).emit('on_receive_message', {
                name: socket.name,
                codeCall: codeCall,
                type: type,
                payload: payload
            });
            return;
        }
        console.log(socket.id + ' been not login! ' + __dirname);
    });
}
module.exports.handleMessage = handleMessage;
