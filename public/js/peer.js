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
    this.socket = io();
    this.codeCall = undefined;
    this.pc = undefined;
    this.socket.emit('login', {
        name: nameId
    });
    this.socket.once('resultLogin', function(data) {
        setTimeout(function() {
            if (point.onLogin) {
                point.onLogin(data);
            }
        }, 0);
        console.log(data.status);
    });
    this.socket.on('on_receive_message', function(msg) {
        if (point.pc === undefined || point.codeCall !== msg.codeCall) {
            return;
        }
        if (msg.type === "candidate") {
            point.pc.addIceCandidate(new RTCIceCandidate(msg.payload));
        } else if (msg.type === "offer") {
            point.pc.setRemoteDescription(new RTCSessionDescription(msg.payload));
            point.pc.createAnswer()
                .then(function(answer) {
                    point.pc.setLocalDescription(answer);
                    sendMessage(msg.name, point.codeCall, "answer", answer);
                    console.log(name);
                })
                .catch(function(error) {
                    console.log(error);
                });
        } else if (msg.type === "answer") {
            console.log('nhan answer');
            point.pc.setRemoteDescription(new RTCSessionDescription(msg.payload));
        }
    });
    // when is called
    this.socket.on('waitForCaller', function(data) {
        point.codeCall = data.codeCall;
        var name = data.name;
        setTimeout(function() {
            if (point.onCall) {
                point.onCall(name);
            }
        }, 0);
        point.reply = function(answer) {
            if (!answer) {
                console.log(point.codeCall);
                console.log(answer);
                point.clean();
                point.socket.emit('rely', {
                    name: name,
                    answer: false,
                    codeCall: data.codeCall
                });
                return;
            }
            point.pc = new RTCPeerConnection(config);
            point.pc.onaddstream = function(event) {
                console.log('remote');
                console.log(event.stream);
                setTimeout(function() {
                    if (point.onRemoteStream) {
                        point.onRemoteStream(event.stream);
                    }
                }, 0);
            };
            point.pc.oniceconnectionstatechange = handleIceConnectionStateChange;
            point.pc.onicecandidate = function(event) {
                if (event.candidate) {
                    console.log("handleIceCandidate");
                    sendMessage(name, point.codeCall, "candidate", event.candidate);
                    console.log(name);
                }
            };
            point.socket.emit('rely', {
                name: name,
                answer: true,
                codeCall: point.codeCall
            });
            point.socket.on('callerReady', function(data) {
                if (point.codeCall !== data.codeCall) {
                    return;
                }
                navigator.mediaDevices.getUserMedia({
                        "audio": true,
                        "video": true
                    })
                    .then((stream) => {
                        console.log('local');
                        point.pc.addStream(stream);
                        point.localStream = stream;
                        point.socket.emit('calleeReady', {
                            name: name,
                            codeCall: point.codeCall
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
    this.call = function(name) {
        if (this.pc !== undefined) {
            console.log('Khong ther goi');
            return;
        }
        console.log('Bắt đầu gọi!');
        this.pc = new RTCPeerConnection(config);
        this.codeCall = Date.now().toString(); // code room
        this.socket.emit('call', {
            name: name,
            codeCall: point.codeCall
        });
        this.socket.on('resultCall', function(data) {
            console.log(data);
            if (data.status === 101) {
                console.log(name + ' không sẵn sàng ');
                point.clean();
                setTimeout(function() {
                    if (point.onReject) {
                        point.onReject();
                    }
                }, 0);
                return;
            }
            if (point.codeCall !== data.codeCall) {
                console.log('sai codeCall');
                return;
            }
            if (!data.answer) {
                console.log(name + ' từ chối cuộc gọi');
                point.clean();
                setTimeout(function() {
                    if (point.onReject) {
                        point.onReject();
                    }
                }, 0);
                return;
            }
            console.log(name + ' đồng ý cuộc gọi');
            // prepare
            point.pc.onaddstream = function(event) {
                console.log('remote');
                console.log(event.stream);
                setTimeout(function() {
                    if (point.onRemoteStream) {
                        point.onRemoteStream(event.stream);
                    }
                }, 0);
            };
            point.pc.oniceconnectionstatechange = handleIceConnectionStateChange;
            point.pc.onicecandidate = function(event) {
                if (event.candidate) {
                    console.log("handleIceCandidate");
                    console.log(name);
                    sendMessage(name, point.codeCall, "candidate", event.candidate);
                }
            };
            // get stream
            navigator.mediaDevices.getUserMedia({
                    "audio": true,
                    "video": true
                })
                .then(function(stream) {
                    console.log('local');
                    point.pc.addStream(stream);
                    point.localStream = stream;
                    point.socket.emit('callerReady', {
                        name: name,
                        codeCall: point.codeCall
                    });
                    console.log('da gui');
                    setTimeout(function() {
                        if (point.onLocalStream) {
                            point.onLocalStream(stream);
                        }
                    }, 0);
                })
                .catch(function(error) {});
                point.socket.on('calleeReady', function(data) {
                if (data.codeCall !== point.codeCall) {
                    return;
                }
                point.pc.createOffer(constraints)
                    .then(function(offer) {
                        console.log("Create offer for ", name);
                        point.pc.setLocalDescription(offer);
                        console.log(name);
                        sendMessage(name, point.codeCall, "offer", offer);
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            });
        });
    };


    this.clean = function() {
        console.log('Close');
        delete this.pc;
        this.codeCall = undefined;

        this.socket.removeAllListeners('calleeReady');
        this.socket.removeAllListeners('callerReady');
        this.socket.removeAllListeners('resultCall');
    }
    this.hangup = function() {
        if (this.pc) {
            this.pc.close();
        }

    };
    this.stopStream = function() {
        if (this.localStream) {
            this.localStream.getAudioTracks()[0].stop();
            this.localStream.getVideoTracks()[0].stop();
            delete this.localStream;
        }
    };

    function handleIceConnectionStateChange(event) {
        var pcx = event.target;
        console.log('[handleIceConnectionStateChange]', pcx.iceConnectionState)
        if (pcx.iceConnectionState === 'closed' || pcx.iceConnectionState === 'disconnected' || pcx.iceConnectionState === 'failed') {
            point.clean();
            point.stopStream();
            setTimeout(function() {
                point.onClose();
            }, 0);
            console.log('hangup');
        }
        if (pcx.iceConnectionState == 'connected') {
            console.log('Call successdull');
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
        point.socket.emit('message', msg);
    };

};
