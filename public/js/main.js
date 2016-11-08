/*var config = {
    'iceServers': [{
        'url': 'stun:stun.l.google.com:19302'
    }]
};*/

var config = null;
var constraints = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1
};
var local = document.getElementById('local');
var remote = document.getElementById('remote');
var buttonCall = $('#call');
var inputCallee = $('#callee');
var socket = io();
socket.on('connect', () => {
    socket.emit('login', {
        name: 'linh'
    });
});
buttonCall.on('click', () => {
    console.log('goi');
    var name = inputCallee.val();
    var pc = new RTCPeerConnection(config);
    pc.onaddstream = handleRemoteStream;
    pc.oniceconnectionstatechange = handleIceConnectionStateChange;
    pc.onicecandidate = function(event) {
        if (event.candidate) {
            console.log("handleIceCandidate");
            sendMessage(name, "candidate", event.candidate);
        }
    };

    socket.emit('call', {
        name: name
    });
    socket.on('resultCall', (data) => {
        navigator.mediaDevices.getUserMedia({
                "audio": true,
                "video": true
            })
            .then((stream) => {
                pc.addStream(stream);
                local.src = window.URL.createObjectURL(stream);
                pc.createOffer(constraints)
                    .then(function(offer) {
                        console.log("Create offer for ", name);
                        pc.setLocalDescription(offer);
                        sendMessage(name, "offer", offer);
                    })
                    .catch(errorLog);
            })
            .catch(errorLog);
    });
    socket.on('on_receive_message', function(msg) {
        if (msg.type === "candidate") {
            pc.addIceCandidate(new RTCIceCandidate(msg.payload));
        } else if (msg.type === "offer") {
            pc.setRemoteDescription(new RTCSessionDescription(msg.payload));
            pc.createAnswer()
                .then(function(answer) {
                    pc.setLocalDescription(answer);
                    sendMessage(msg.from, "answer", answer);
                })
                .catch(errorLog);
        } else if (msg.type === "answer") {
            console.log('nhan answer');
            pc.setRemoteDescription(new RTCSessionDescription(msg.payload));
        }
    });
});

socket.on('waitForCaller', (data) => {
    console.log('nhan');
    var pc = new RTCPeerConnection(config);
    pc.onaddstream = handleRemoteStream;
    pc.oniceconnectionstatechange = handleIceConnectionStateChange;
    pc.onicecandidate = function(event) {
        if (event.candidate) {
            console.log("handleIceCandidate");
            sendMessage(name, "candidate", event.candidate);
        }
    };
    navigator.mediaDevices.getUserMedia({
            "audio": true,
            "video": true
        })
        .then((stream) => {
            pc.addStream(stream);
            local.src = window.URL.createObjectURL(stream);
            socket.emit('rely', {
                name: data.name,
                answer: true
            });
        })
        .catch(errorLog);
    socket.on('on_receive_message', function(msg) {
        if (msg.type === "candidate") {
            pc.addIceCandidate(new RTCIceCandidate(msg.payload));
        } else if (msg.type === "offer") {
            console.log('nhan offer');
            pc.setRemoteDescription(new RTCSessionDescription(msg.payload));
            pc.createAnswer()
                .then(function(answer) {
                    pc.setLocalDescription(answer);
                    sendMessage(msg.from, "answer", answer);
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
    remote.src = window.URL.createObjectURL(event.stream);
}

function handleIceConnectionStateChange(event) {
    var pc = event.target;
    console.log('[handleIceConnectionStateChange]', pc.iceConnectionState)
    if (pc.iceConnectionState == 'closed') {

    }
    if (pc.iceConnectionState == 'connected') {

    }
};

function sendMessage(to, type, payload) {
    console.log('[sendMessage]', to, type, payload);
    var msg = {
        to: to,
        type: type,
        payload: payload
    };
    socket.emit('message', msg);
};

function errorLog(e) {
    console.log(e.name + ": " + e.message);
};
