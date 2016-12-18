#Call video
## Start server node app.js
## Import dependence
###<script src="/socket.io/socket.io.js"</script>
###<script src="/out/adapter.js"></script>
###<script src="/js/peer.js"></script>

##Usage
###Create a peer to Call
####var pc = new peer(nameId);
###Call to callee
#### pc.call(nameCallee);
###Listening caller
####pc.onCall = handler ; params [name]
### Event
#### pc.onLogin = handler ; params [status]
#### pc.onLocalStream
#### pc.onRemoteStream
#### onClose
#### onReject
