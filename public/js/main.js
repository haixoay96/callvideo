var pc;
$('#buttonLogin').on('click', function() {
    var name = $('#inputLogin').val();
    pc = new peer(name);
    pc.onLogin = function(data) {
        alert(data);
    };
    pc.onCall = function(name) {
        if (!confirm('Leave This Conference?')) {
            pc.rely(false);
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
    pc.onClose = function () {

    };
});

//  $('#login-modal').modal('toggle')


$('#buttonCall').on('click', function() {
    var name = $('#inputCall').val();
    pc.call(name);
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

    };
});
