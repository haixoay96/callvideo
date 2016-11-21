var config = {
    'iceServers': [{
        'urls': 'stun:stun.l.google.com:19302'
    }, {
        'urls': 'turn:numb.viagenie.ca:3478',
        'username': 'haixoay96@gmail.com',
        'credential': '123456'

    }]
};

function Peer(name) {
    var socket = io();
    socket.on('connect', function () {
        // body...
        console.log('connect!');
        socket.emit('login', {
            name: name
        });
        socket.on('resultLogin', function (data) {
            // body...
        });
    });
    socket.on('connect_error', function () {
        console.log('connect_error!');
    })
    socket.on('reconect', function (number) {
        console.log('reconect '+ number);
    })
    socket.on('reconnect_attempt', function () {
        console.log('reconnect_attempt!')
    })
    socket.on('reconecting', function (number) {
        console.log('reconnecting!')
    })
    socket.on('reconnect_error', function () {
        console.log('reconnect_error!');
    })
    socket.on('reconnect_failed', function () {
        console.log('reconnect_failed!');
    })
    this.pc = new RTCPeerConnection(config);
    this.pc.ontrack = function(event) {
        onsole.log('remote');
        remote.src = window.URL.createObjectURL(event.streams[0]);
    }
    this.pc.oniceconnectionstatechange = function(argument) {
        // body...
    }
    this.pc.onicecandidate = function(argument) {
        // body...
    }

    // handle call

    this.call = function(name, callback) {
        // body...
    };
    this.anwser = function(anwser, callback) {
        // body...
    };

}