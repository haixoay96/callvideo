var handleReply = (socket) => {
    socket.on('reply', (data) => {
        if (socket.name) {
            var name = data.name;
            var codeCall = data.codeCall;
            var answer = data.answer;
            console.log(data);
            console.log(socket.name + ' reply ' + name +' '+ answer+  ' ' + __dirname);
            socket.broadcast.to(name).emit('resultCall', {
                status: 100,
                answer: answer,
                name: socket.name,
                codeCall: codeCall
            });
            return;
        }
        console.log(socket.id + ' been not login! ' + __dirname);
    });
}
module.exports.handleReply = handleReply;
