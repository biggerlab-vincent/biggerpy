function mycodeController()
{
    loadCodeList()
    $('.demo-ls').on('click', '.code_edit', function () {
        var index=$(".code_edit").index(this);
        var lessonID = $('.codeId').eq(index).val();
        var id = $('.id').eq(index).val();
        var url = "/home?id=" + id;
        window.location.href = url;
        //console.log(index,lessonID,id);
        /*
        $.ajax({
            type: "POST",
            url: "edit_code",
            data: {"id":id },
            success: function(data){
                console.log(data);
                id_edit = data._id;
                code_edit = data.code;
                console.log(id_edit,code_edit);
                var url = "/home?code_edit=" + code_edit+ "&id_edit=" + id_edit;
                window.location.href = url;
            }
          })
          */
    })
    $('.demo-ls').on('click', '.code_delete', function () {
        var index=$(".code_delete").index(this);
        var lessonID = $('.codeId').eq(index).val();
        var id = $('.id').eq(index).val();
        //console.log(index,lessonID,id);
        $.ajax({
            type: "POST",
            url: "delete_code",
            data: {"id":id },
            success: function(){
                editorModalAlert("Successfully Deleted.");
            }
          })
    })
}
function loadCodeList() {
    var options = {
        type: 'POST',
        url: "loadCodeList",
        data: JSON.stringify({}),
        success: function (data) {
            var title = [];
            var htmlToInsert = '';
            if(data.length == 0){
                htmlToInsert = '<h1>Please save your code.</h1>';
            }
            for (var i = 0; i < data.length; i++) {
                codeTitle = data[i]["title"];
                codeTime = data[i]['time'];
                codeId = data[i]["_id"].toString();
                lessonID =data[i]["lessonID"].toString();
                code = String(data[i]["code"]);
                htmlToInsert +=  '<li class="demo">\
                                    <img src="/img/code-logo.jpeg">\
                                    <div class="code-control">\
                                        <button class ="code_edit btn" >edit</button>\
                                        <button class ="code_delete btn">delete</button>\
                                    </div>\
                                    <div class="code-info">\
                                        <p> Title:<span> ' + codeTitle + 
                                            '</span></p>\
                                        <p> Time:<span>' + codeTime +
                                        '</span></p>\
                                    </div>\
                                    <form style=display:none method=“POST” action="/delete_code">\
                                        <input class="id" name="id" value="' +data[i]["_id"] + '"/>\
                                        <input class= "codeId" name="lessonID" value="' + lessonID + '"/>\
                                        <input class="code" name="code" value="' + code + '"/>\
                                    </form>\
                                </li>'
                                
            }
            $(".demo-ls").html(htmlToInsert);
            
        },
        dataType: "json",
    }
    $.ajax(options);
}

function codeEdit() {
    console.log(11);
    var id = $('.id').val();
    $.ajax({
        type: "POST",
        url: "edit_code",
        data: {
            "id":id 
        },
        success: function(data){
            console.log(data.name)
            window.addEventListener('storage', function(data) {  
                console.log(data.key + "'s value is changed from '" +  
                    data.oldValue + "' to '" + data.newValue + "' by " + data.url);  
            }, false); 
        }
      })
     
}

function codeDelete() {
    console.log(111);
    var index=$("button").index(this);
    var lessonID = $('.codeId').eq(index).val();
    var id = $('.id').eq(index).val();
    console.log(index);
    $.ajax({
        type: "POST",
        url: "delete_code",
        data: {"id":id },
        success: function(){
            editorModalAlert("Successfully Deleted.");
        }
      })
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
    loadCodeList();
}
