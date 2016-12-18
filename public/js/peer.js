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

function peer(nameId) {
    //login
    var point = this;
    var socket = io();
    var codeCall = undefined;
    var pc;
    socket.emit('login', {
        name: nameId
    });
    socket.once('resultLogin', function(data) {
        setTimeout(function() {
            if (point.onLogin) {
                point.onLogin(data);
            }
        }, 0);
        console.log(data.status);
    });
    socket.on('on_receive_message', function(msg) {
        if(pc=== undefined  || codeCall !== msg.codeCall){
            return;
        }
        if (msg.type === "candidate") {
            pc.addIceCandidate(new RTCIceCandidate(msg.payload));
        } else if (msg.type === "offer") {
            pc.setRemoteDescription(new RTCSessionDescription(msg.payload));
            pc.createAnswer()
                .then(function(answer) {
                    pc.setLocalDescription(answer);
                    sendMessage(msg.name, codeCall, "answer", answer);
                    console.log(name);
                })
                .catch(function(error) {
                    console.log(error);
                });
        } else if (msg.type === "answer") {
            console.log('nhan answer');
            pc.setRemoteDescription(new RTCSessionDescription(msg.payload));
        }
    });
    // when is called
    socket.on('waitForCaller', function(data) {
        codeCall = data.codeCall;
        var name = data.name;
        setTimeout(function() {
            if (point.onCall) {
                point.onCall(name);
            }
        }, 0);
        point.reply = function(answer) {
            if (!answer) {
                socket.emit('rely', {
                    name: data.name,
                    answer: false,
                    codeCall: codeCall
                });
                return;
            }
            pc = new RTCPeerConnection(config);
            pc.onaddstream = function(event) {
                console.log('remote');
                console.log(event.stream);
                setTimeout(function() {
                    if (point.onRemoteStream) {
                        point.onRemoteStream(event.stream);
                    }
                }, 0);
            };
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
                        console.log('local');
                        pc.addStream(stream);
                        socket.emit('calleeReady', {
                            name: name,
                            codeCall: codeCall
                        });
                        setTimeout(function() {
                            if (point.onLocalStream) {
                                point.onLocalStream(stream);
                            }
                        }, 0);
                    })
                    .catch(function(error) {

                    });
            });
        }
        console.log('Co nguoi goi');
    });

    // when call
    point.call = function(name) {
        if(pc !== undefined){
            console.log('Khong ther goi');
            return;
        }
        console.log('Bắt đầu gọi!');
        pc = new RTCPeerConnection(config);
        codeCall = 1; // code room
        socket.emit('call', {
            name: name,
            codeCall: codeCall
        });
        socket.on('resultCall', function(data) {
            if (data.status === 101) {
                console.log(name + ' không sẵn sàng ');
                setTimeout(function() {
                    if (point.onReject) {
                        point.onReject();
                    }
                }, 0);
                return;
            }
            if (codeCall !== data.codeCall) {
                return;
            }
            if (!data.answer) {
                console.log(name + ' từ chối cuộc gọi');
                setTimeout(function() {
                    if (point.onReject) {
                        point.onReject();
                    }
                }, 0);
                return;
            }
            console.log(name + ' đồng ý cuộc gọi');
            // prepare
            pc.onaddstream = function(event) {
                console.log('remote');
                console.log(event.stream);
                setTimeout(function() {
                    if (point.onRemoteStream) {
                        point.onRemoteStream(event.stream);
                    }
                }, 0);
            };
            pc.oniceconnectionstatechange = handleIceConnectionStateChange;
            pc.onicecandidate = function(event) {
                if (event.candidate) {
                    console.log("handleIceCandidate");
                    console.log(name);
                    sendMessage(name, codeCall, "candidate", event.candidate);
                }
            };
            // get stream
            navigator.mediaDevices.getUserMedia({
                    "audio": true,
                    "video": true
                })
                .then(function(stream) {
                    console.log('local');
                    pc.addStream(stream);
                    socket.emit('callerReady', {
                        name: name,
                        codeCall: codeCall
                    });
                    setTimeout(function() {
                        if (point.onLocalStream) {
                            point.onLocalStream(stream);
                        }
                    }, 0);
                })
                .catch(function(error) {});
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
                    .catch(function(error) {
                        console.log(error);
                    });
            });
        });
    };

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

};
