var handleRely = (socket) => {
    socket.on('rely', (data) => {
        if (socket.name) {
            var name = data.name;
            var codeCall = data.codeCall;
            var answer = data.answer;
            console.log(data);
            console.log(socket.name + ' rely ' + name +' '+ answer+  ' ' + __dirname);
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
module.exports.handleRely = handleRely;
