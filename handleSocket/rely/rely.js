var handleRely = (socket) => {
    socket.on('rely', (data) => {
        if (socket.name) {
            var name = data.name;
            var codeCall = data.codeCall;
            var answer = data.answer;
            socket.broadcast.to(name).emit('resultCall', {
                answer: answer,
                name: socket.name,
                codeCall: codeCall
            });
            console.log(socket.name + ' rely ' + name + ' ' + __dirname);
            return;
        }
        console.log(socket.id + ' been not login! ' + __dirname);

    });

}
module.exports.handleRely = handleRely;
