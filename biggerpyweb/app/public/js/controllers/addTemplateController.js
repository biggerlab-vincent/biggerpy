function AddTemplateController()
{
// bind event listeners to button clicks //
    var that = this;

    $('#btn-add').click(function(){ template_add(); });
    $('#btn-update').click(function () { template_update(); });
    $('#btn-delete').click(function () { template_delete(); });
}
   
function template_add() {
    var lessonNum = parseInt($("#lesson-num").val());
    if (lessonNum > 0) {
        $.post("add_template", {lesson: lessonNum, title: $("#lesson-title").val(), content: $("#template-input").val(), contentFinal: $("#final-input").val()}, function( data ) {
            if (data == "ok") {
                // notify user success
                console.log("Successfully Added")
            } else {
                // notify not success
                console.log("fail")
            }
        });
    } else {
        // just fail if not number and tell user!!!
        console.log("fail")
    }
}
function template_update(){
    var lessonNum = parseInt($("#lesson-num").val());
    if (lessonNum > 0) {
        $.post("update_template", { lesson: lessonNum, title: $("#lesson-title").val(), content: $("#template-input").val(), contentFinal: $("#final-input").val() }, function (data) {
            if (data == "ok") {
                // notify user success
                console.log("Successfully updated")
            } else {
                // notify not success
                console.log("fail")
            }
        });
    } else {
        // just fail if not number and tell user!!!
        console.log("fail")
    }
}
function template_delete() {
    var lessonNum = parseInt($("#lesson-num").val());
    if (lessonNum > 0) {
        $.post("delete_template", { lesson: lessonNum, title: $("#lesson-title").val(), content: $("#template-input").val(), contentFinal: $("#final-input").val() }, function (data) {
            if (data == "ok") {
                // notify user success
                console.log("Successfully delete")
            } else {
                // notify not success
                console.log("fail")
            }
        });
    } else {
        // just fail if not number and tell user!!!
        console.log("fail")
    }
}