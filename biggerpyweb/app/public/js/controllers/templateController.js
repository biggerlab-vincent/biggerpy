var editorContent = ace.edit("editorContent");
editorContent.setTheme("ace/theme/xcode");
editorContent.getSession().setMode("ace/mode/python");
editorContent.$blockScrolling = Infinity;
editorContent.commands.commmandKeyBinding = {};
var editorContentFinal = ace.edit("editorContentFinal");
editorContentFinal.setTheme("ace/theme/xcode");
editorContentFinal.getSession().setMode("/ace/mode/python");
editorContentFinal.$blockScrolling = Infinity;
editorContentFinal.commands.commmandKeyBinding = {};


function TemplateController() {
    // bind event listeners to button clicks //
    //var that = this;

    var lessonNum = parseInt($("#lesson-num").val());
    var title = $("#lesson-title").val();
    var content = $("#editorContent").val();
    var contentFinal = $("#editorContentFinal").val();

    $("#btn-create").click(function () { openBlankTem(); });
    $("#btn-add").click(function () { addTem(); });
    $("#btn-update").click(function () { updateTem(); });
    $("#btn-delete").click(function () { deleteTem(); });
    //console.log("test start");
    loadTemplates();
    
    //console.log("test over");
}
var selectedID = "";
//  getTemplate  
function getTemplate() {
    selectedID = $('#selectSampleCode').val();
    $("#lesson-num").val("");
    $("#lesson-title").val("");
    //console.log(selectedID);
    //
    var options = {
        type : 'POST',
        url : "manageTemplate",
        data : { "id": selectedID },
        success : function(data) {
            //console.log(111);
            //console.log(data);
            if (data) {
                $("#lesson-num").val(data.lesson);
                $("#lesson-title").val(data.title);
                editorContent.setValue(data.content);
                editorContentFinal.setValue(data.contentFinal);
            } else {
                console.log("failed");
                return;
                // editor.setValue(teacherMode ? lessonFinalForIndex(selectedIndex) : lessonTemplateForIndex(selectedIndex));
            }
        },
        dataType : "json",
    }
    $.ajax(options);
}

function loadTemplates() {
    $.post("load_template_list", { "entry": ("save" + selectedID) }, function (data) {
        if(data){
            var currentLesson = 0;
            var htmlToInsert = '';
            for (var i = 0; i < data.length; i++) {
                if (data[i]["lesson"] > currentLesson) {
                    currentLesson = data[i]["lesson"];
                    htmlToInsert += '<optgroup label="Lesson ' + currentLesson + '">';
                }
                htmlToInsert += '<option value="' + data[i]["_id"].toString() + '">' + data[i]["title"] + '</option>';
                if (i + 1 >= data.length || data[i + 1]["lesson"] > currentLesson) {
                    htmlToInsert += '</optgroup>';
                }
            }
            $("#selectSampleCode").append(htmlToInsert);
            //$("#selectSampleCode").selectpicker("refresh");
        }else{
            //error
        }
        //$("#selectSampleCode").selectpicker("refresh");
    
    });
}




/*
manage  Template
*/
function templateModalAlert(msg) {
    var if_succeed = msg.indexOf("Successfully");
    $('.modal-alert').modal({ show: false, keyboard: false, backdrop: 'static' });
    if (if_succeed == -1){ 
        $('.modal-alert .modal-header h4').text('Fail!');
    }else{
        $('.modal-alert .modal-header h4').text('Success!');
        setTimeout(function () { window.location.reload(); }, 2000);
    }
    $('.modal-alert .modal-body p').html(msg);
    $('.modal-alert').modal('show');
    
}
function openBlankTem() {
    $("#lesson-num").val("");
    $("#lesson-title").val("");
    editorContent.setValue("");
    editorContentFinal.setValue("");
    setTimeout('templateModalAlert("Successfully Opened A New Blank.")', 1000)
    /*
    var lessonNum = parseInt($("#lesson-num").val());
    if (lessonNum > 0) {
        $("#lesson-num").val("");
        $("#lesson-title").val("");
        $("#editorContent").setValue("");
        $("#editorContentFinal").setValue("");
        setTimeout('alert("open Blank succeed")', 1000)
    } else {
        // just fail if not number and tell user!!!
        console.log("fail")
    }
    */
}
function addTem() {
    var lessonNum = parseInt($("#lesson-num").val()); 
    var title = $("#lesson-title").val();
    var content =  editorContent.getValue();
    var contentFinal = editorContentFinal.getValue();  
    console.log(content + contentFinal) ;
    if (lessonNum > 0) {
        $.post("add_template", { lesson: lessonNum, title: title, content: content, contentFinal : contentFinal }, function( data ) {
            //console.log(data);
            if (data == "ok") {
                // notify user success
                templateModalAlert("Successfully Added!");
                console.log("Successfully Added");
            } else {
                // notify not success
                templateModalAlert("Try again,plaease ");
                console.log("fail")
            }
        });
    } else {
        // just fail if not number and tell user!!!
        templateModalAlert("Try again,plaease ");
        console.log("fail")
    }

}
function updateTem(){
    var lessonNum = parseInt($("#lesson-num").val());
    var title = $("#lesson-title").val();
    var content = editorContent.getValue();
    var contentFinal = editorContentFinal.getValue();  
    console.log(selectedID);
    if (lessonNum > 0) {
        //console.log(0)
        var options ={
            type: 'POST',
            url: "update_template",
            data: { "id": selectedID, "lesson": lessonNum, "title": title, "content": content, "contentFinal": contentFinal},
            success: function (data) {
                //console.log(111);
                //console.log(data);
                if (data == "ok") {
                    // notify user success
                    templateModalAlert("Successfully updated!");
                    console.log("Successfully updated");
                } else {
                    console.log("failed");
                    templateModalAlert("Try again,plaease");
                } 
            }
        }
         $.ajax(options);
        /*
        $.post("update_template", { lesson: lessonNum, title: title, content: content, contentFinal: contentFinal }, function (data) {
            console.log(data)
            if (data == "ok") {
                // notify user success
                templateModalAlert("Successfully updated!");
                console.log("Successfully updated");
                //loadTemplates();
            } else {
                // notify not success
                templateModalAlert("Try again,plaease");
                console.log("fail")
            }
        });
        */
    } else {
        // just fail if not number and tell user!!!
        templateModalAlert("Try again,plaease");
        console.log("fail")
    }
    
}
function deleteTem() {
    if (selectedID) {
        $.post("delete_template", { "id": selectedID }, function (data) {
            if (data == "ok") {
                // notify user success
                templateModalAlert("Successfully delete!");
                console.log("Successfully delete");
                loadTemplates();
            } else {
                // notify not success
                templateModalAlert("Try again,plaease ");
                console.log("fail")
            }
        });
    } else {
        // just fail if not number and tell user!!!
        templateModalAlert("Try again,plaease ");
        console.log("fail")
    }
}

