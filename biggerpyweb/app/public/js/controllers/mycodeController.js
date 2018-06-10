function mycodeController()
{
    $(".code_editor").click(function(){ codeEditor(); });
    $(".code_delete").click(function(){ codeDelete(); });

    loadCodeList()
}

function loadCodeList() {
    $.post("loadCodeList", function (data) {
        if (data) {
            console.log(111111);
           console.log(data);
            //$("#selectSampleCode").selectpicker("refresh",true);
        } else {

            console.log(00000);
            console.log(error);
            // error
        }
    });
}

function codeEditor() {
    $.post("loadCodeList", function (data) {
        if (data) {
            console.log(data);
            //$("#selectSampleCode").selectpicker("refresh",true);
        } else {
            consol.log(error)
            // error
        }
    });
}

function codeDelete() {
    $.post("loadCodeList", function (data) {
        if (data) {
            console.log(data);
            //$("#selectSampleCode").selectpicker("refresh",true);
        } else {
            consol.log(error)
            // error
        }
    });
}
function editorModalAlert(msg) {
    var if_succeed = msg.indexOf("Successfully");
    $('.modal-alert').modal({ show: false, keyboard: false, backdrop: 'static' });
    if (if_succeed == -1) {
        $('.modal-alert .modal-header h4').text('Fail!');
    } else {
        $('.modal-alert .modal-header h4').text('Success!');
        //setTimeout(function () { window.location.reload(); }, 2000);
    }
    $('.modal-alert .modal-body p').html(msg);
    $('.modal-alert').modal('show');
}
