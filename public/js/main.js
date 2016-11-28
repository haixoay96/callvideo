var socket = io();
$('#buttonLogin').on('click', function() {
    var name = $('#inputLogin').val();
    socket.emit('login', {
        name: name
    });
    $('#login-modal').modal('toggle')
    socket.once('resultLogin', function(data) {
        alert(data.status);
    });
});


var config = {
    'iceServers': [{
        'urls': 'stun:stun.l.google.com:19302'
    }, {
        'urls': 'turn:numb.viagenie.ca:3478',
        'username': 'haixoay96@gmail.com',
        'credential': '123456'

    }]
};

var constraints = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1
};

socket.on('connect', () => {
    console.log('thanh cong!');
});
$('#buttonCall').on('click', function() {
    console.log('goi');
    var name = $('#inputCall').val();
    var pc = new RTCPeerConnection(config);
    var codeCall = 1; // code room
    socket.emit('call', {
        name: name,
        codeCall: codeCall
    });
    socket.on('resultCall', function(data) {
        if (codeCall !== data.codeCall) {
            return;
        }
        if (!data.answer) {
            return;
        }
        pc.ontrack = handleRemoteStream;
        pc.oniceconnectionstatechange = handleIceConnectionStateChange;
        pc.onicecandidate = function(event) {
            if (event.candidate) {
                console.log("handleIceCandidate");
                console.log(name);
                sendMessage(name, codeCall, "candidate", event.candidate);
            }
        };
        navigator.mediaDevices.getUserMedia({
                "audio": true,
                "video": true
            })
            .then(function(stream) {
                pc.addStream(stream);
                $('#local').attr('src', window.URL.createObjectURL(stream));
                socket.emit('callerReady', {
                    name: name,
                    codeCall: codeCall
                });
            })
            .catch(errorLog);
        socket.on('calleeReady', function(data) {
            if (data.codeCall !== codeCall) {
                return;
            }
            pc.createOffer(constraints)
                .then(function(offer) {
                    console.log("Create offer for ", name);
                    pc.setLocalDescription(offer);
                    console.log(name);
                    sendMessage(name, codeCall, "offer", offer);
                })
                .catch(errorLog);
        });
    });
    socket.on('on_receive_message', function(msg) {
        if (msg.type === "candidate") {
            pc.addIceCandidate(new RTCIceCandidate(msg.payload));
        } else if (msg.type === "offer") {
            pc.setRemoteDescription(new RTCSessionDescription(msg.payload));
            pc.createAnswer()
                .then(function(answer) {
                    pc.setLocalDescription(answer);
                    sendMessage(name, codeCall, "answer", answer);
                    console.log(name);
                })
                .catch(errorLog);
        } else if (msg.type === "answer") {
            console.log('nhan answer');
            pc.setRemoteDescription(new RTCSessionDescription(msg.payload));
        }
    });

});
socket.on('waitForCaller', (data) => {
    if (!confirm('Leave This Conference?')) {
        return;
    };
    var codeCall = data.codeCall;
    var name = data.name;
    console.log('nhan');
    var pc = new RTCPeerConnection(config);
    pc.ontrack = handleRemoteStream;
    pc.oniceconnectionstatechange = handleIceConnectionStateChange;
    pc.onicecandidate = function(event) {
        if (event.candidate) {
            console.log("handleIceCandidate");
            sendMessage(name, codeCall, "candidate", event.candidate);
            console.log(name);
        }
    };
    socket.emit('rely', {
        name: data.name,
        answer: true,
        codeCall: codeCall
    });
    socket.on('callerReady', function(data) {
        if (codeCall !== data.codeCall) {
            return;
        }
        navigator.mediaDevices.getUserMedia({
                "audio": true,
                "video": true
            })
            .then((stream) => {
                pc.addStream(stream);
                $('#local').attr('src', window.URL.createObjectURL(stream));
                socket.emit('calleeReady', {
                    name: name,
                    codeCall: codeCall
                });
            })
            .catch(errorLog);
    });
    socket.on('on_receive_message', function(msg) {
        if (msg.type === "candidate") {
            pc.addIceCandidate(new RTCIceCandidate(msg.payload));
        } else if (msg.type === "offer") {
            console.log('nhan offer');
            pc.setRemoteDescription(new RTCSessionDescription(msg.payload));
            pc.createAnswer()
                .then(function(answer) {
                    pc.setLocalDescription(answer);
                    sendMessage(name, codeCall, "answer", answer);
                    console.log(name);
                })
                .catch(errorLog);
        } else if (msg.type === "answer") {
            pc.setRemoteDescription(new RTCSessionDescription(msg.payload));
        }
    });

});


function makeOffer(pc) {
    pc.createOffer(constraints)
        .then(function(offer) {
            console.log("Create offer for ", user);
            pc.setLocalDescription(offer);
            sendMessage(user, "offer", offer);
        })
        .catch(errorLog);
};

function handleRemoteStream(event) {
    console.log('remote');
    $('#remote').attr('src', window.URL.createObjectURL(event.streams[0]));
}

function handleIceConnectionStateChange(event) {
    var pc = event.target;
    console.log('[handleIceConnectionStateChange]', pc.iceConnectionState)
    if (pc.iceConnectionState == 'closed') {

    }
    if (pc.iceConnectionState == 'connected') {

    }
};

function sendMessage(name, codeCall, type, payload) {
    console.log('[sendMessage]', name, type, payload);
    var msg = {
        name: name,
        codeCall: codeCall,
        type: type,
        payload: payload
    };
    socket.emit('message', msg);
};

function errorLog(e) {
    console.log(e.name + ": " + e.message);
    console.log('Lỗi');
};
