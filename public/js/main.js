/*var config = {
    'iceServers': [{
        'urls': 'stun:stun.l.google.com:19302'
    }, {
        // 'urls' : 'turn:54.238.175.111:3478',
        // 'username' : 'callwork',
        // 'credential' : 'beetsoft123'
        'urls': 'turn:numb.viagenie.ca:3478',
        'username': 'haixoay96@gmail.com',
        'credential': '123456'

    }]
};
*/
/*var config =  {
  'iceServers': [
    {
      'url': 'stun:stun.l.google.com:19302'
    },
    {
      'url': 'turn:192.158.29.39:3478?transport=udp',
      'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      'username': '28224511:1379330808'
    },
    {
      'url': 'turn:192.158.29.39:3478?transport=tcp',
      'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      'username': '28224511:1379330808'
    }
  ]
};*/
var constraints = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1
};
var local = document.getElementById('local');
var remote = document.getElementById('remote');
var buttonCall = $('#call');
var inputCallee = $('#callee');
var buttonLogin = $('#login');
var inputName = $('#name');
var socket = io();
socket.on('connect', () => {
    console.log('thanh cong!');
});
buttonLogin.on('click', () => {
    socket.emit('login', {
        name: inputName.val()
    });
    $('#control').hide();
    $('#display').show();
});
buttonCall.on('click', () => {
    console.log('goi');
    var name = inputCallee.val();
    var pc = new RTCPeerConnection(config);


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
                pc.ontrack = handleRemoteStream;
                pc.oniceconnectionstatechange = handleIceConnectionStateChange;
                pc.onicecandidate = function(event) {
                    if (event.candidate) {
                        console.log("handleIceCandidate");
                        console.log(name);
                        sendMessage(name, "candidate", event.candidate);
                    }
                };
                local.src = window.URL.createObjectURL(stream);
                pc.createOffer(constraints)
                    .then(function(offer) {
                        console.log("Create offer for ", name);
                        pc.setLocalDescription(offer);
                        console.log(name);
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
                    sendMessage(name, "answer", answer);
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
    console.log('nhan');
    var pc = new RTCPeerConnection(config);
    var name = data.name;
    navigator.mediaDevices.getUserMedia({
            "audio": true,
            "video": true
        })
        .then((stream) => {
            pc.addStream(stream);
            pc.ontrack = handleRemoteStream;
            pc.oniceconnectionstatechange = handleIceConnectionStateChange;
            pc.onicecandidate = function(event) {
                if (event.candidate) {
                    console.log("handleIceCandidate");
                    sendMessage(name, "candidate", event.candidate);
                    console.log(name);
                }
            };
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
                    sendMessage(name, "answer", answer);
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
    remote.src = window.URL.createObjectURL(event.streams[0]);
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
    console.log('Lỗi');
};
