var pc;
$('#buttonLogin').on('click', function() {
    var name = $('#inputLogin').val();
    pc = new peer(name);
    pc.onLogin = function(data) {
        alert(data);
    };
    pc.onCall = function(name) {
        if (!confirm('Leave This Conference?')) {
            console.log('tu choi');
            pc.reply(false);
            return;
        };
        pc.reply(true);
    };
    pc.onLocalStream = function(stream) {
        $('#local').attr('src', window.URL.createObjectURL(stream));
    };
    pc.onRemoteStream = function(stream) {
        $('#remote').attr('src', window.URL.createObjectURL(stream));
    };
    pc.onCancel = function () {

    };
    pc.onClose = function () {
        console.log('close');

    };

    //call pc.hangup() when want to finish
});

//  $('#login-modal').modal('toggle')
$('#hangup').on('click', function () {
    pc.hangup();
});

$('#buttonCall').on('click', function() {
    var name = $('#inputCall').val();
    pc.call(name);
    setTimeout(function () {
        pc.cancelCall();
    }, 40000);
    //call when want cancel call pc.cancelCall();
    pc.onReject = function() {
        console.log('Tu choi');
    };
    pc.onLocalStream = function(stream) {
        $('#local').attr('src', window.URL.createObjectURL(stream));
    };
    pc.onRemoteStream = function(stream) {
        $('#remote').attr('src', window.URL.createObjectURL(stream));
    };
    pc.onClose = function () {
        console.log('close');
    };
    //call pc.hangup() when want to finish
});
