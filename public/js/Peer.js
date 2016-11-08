function Peer() {
    this.pc = new RTCPeerConnection(config);
    this.addStream = (localstream) => {
        this.pc.addStream(localstream);
    };
    this.pc.onicecandidate = (event) => {

    };
    this.pc.oniceconnectionstatechange = (event) => {
        var pc = event.target;
        if (pc.iceConnectionState === 'closed') {
            delete pc;
        }
        if (pc.iceConnectionState === 'connected') {

        }
    };
    this.createOffer = (callback) => {
        this.pc.createOffer(constraints)
            .then(function(offer) {
                console.log("Create offer for ", user);
                this.pc.setLocalDescription(offer);
                sendMessage(user, "offer", offer);
            })
            .catch(errorLog);
    };
    this.createAnswer = (callback) => {
        this.pc.createAnswer()
            .then(function(answer) {
                this.pc.setLocalDescription(answer);
                sendMessage(msg.from, "answer", answer);
            })
            .catch(errorLog);
    };
    this.addIceCandidate = (payload) => {
        this.pc.addIceCandidate(new new RTCIceCandidate(payload));
    };
    this.setRemoteDescription = (payload) => {
        this.pc.setRemoteDescription(new RTCSessionDescription(payload));
    };

}
