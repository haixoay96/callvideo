var t = "/danh-sach-mon-hoc/" + $registrationMode + "/" + 1;
ajaxRequest("POST", t, "html", function (n) {
    $("#divDSDK table tbody").empty();
    $("#divDSDK table tbody").html(n);
}, function () {

}, function () {

}, !0);
0006582
<input type="checkbox" data-rowindex="222" data-crdid="0006582" data-numcrd="3" value="" class="order">
