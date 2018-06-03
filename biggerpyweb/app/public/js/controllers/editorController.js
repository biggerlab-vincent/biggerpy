function EditorController()
{
// bind event listeners to button clicks //
    //var that = this;

    $("#btn-replace").click(function(){ replaceIP(); });
    //$("#server-list").click(function(){ getserver(); });
    $("#btn-save").click(function(){ save(); });
    $("#btn-load").click(function(){ load(); });
    $("#btn-run").click(function(){ runPythonScript(); });
    $("#btn-stop").click(function(){ stopPython(); });
    $("#btn-reset").click(function(){ reset(); });
    $("#btn-loadHint").click(function(){ loadHint(); });
    $("#btn-saveHint").click(function(){ saveHint(); });
    $("#btn-loadTemplate").click(function(){ changeToTemplate(false); });
    $("#btn-loadFinal").click(function(){ changeToTemplate(true); });

    $("#btn-editor").click(function () {
        $("#btn-editor").addClass("active");
        $("#btn-hint").removeClass("active");
        $("#editor").removeClass("hide");
        $("#secondEditor").addClass("hide");
    });
     $("#btn-hint").click(function () {
         $("#btn-hint").addClass("active");
         $("#btn-editor").removeClass("active");
         $("#editor").addClass("hide");
         $("#secondEditor").removeClass("hide");
     });

    editor.setValue(`import mcpi.minecraft as minecraft
mc = minecraft.Minecraft.create()
mc.postToChat("Hello Minecraft World")
# Welcome to BiggerLab's Minecraft Python Editor`);
    loadTemplates();
    

    if (user.userType === "student") {
        secondEditor.setOptions({
            readOnly: true,
            highlightActiveLine: false ,
            highlightGutterLine: false ,
        });
        secondEditor.setValue("# Teacher Hints");
    } else {
        secondEditor.setValue("# Paste your hints here");
    }
}



/*==================================*/
/*Your webserver IP after deployment*/
var ip =     "localhost";
/*==================================*/
var selectedServer =$('#server-list').val();
var teacherMode = false;
//ace.require("ace/ext/language_tools");
var editor = ace.edit("editor");
editor.setTheme("ace/theme/xcode");
editor.getSession().setMode("ace/mode/python");
editor.$blockScrolling = Infinity;
var langTools = ace.require("ace/ext/language_tools");
editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
});
var staticWordCompleter = {
    getCompletions: function(editor, session, pos, prefix, callback) {
        var wordList = ["minecraft", "Minecraft", "create", "player", "getTilePos", "setBlock", "events", "pollBlockHits", "pos", "getBlock", "postToChat"];
        callback(null, wordList.map(function(word) {
            return {
                caption: word,
                value: word,
                meta: "static"
            };
        }));

    }
};
langTools.addCompleter(staticWordCompleter);

var secondEditor = ace.edit("secondEditor");
secondEditor.setTheme("ace/theme/xcode");
secondEditor.getSession().setMode("ace/mode/python");
secondEditor.$blockScrolling = Infinity;
secondEditor.commands.commmandKeyBinding={};

var selectedID = "";
var ws = new WebSocket('wss://minecraft.biggerlab.com'); // ws://localhost:3000 | wss://biggerpyweb.herokuapp.com/
ws.onmessage = function (event) {
    if (!event.data) return;
    var receivedObject = JSON.parse(event.data)
    if (receivedObject.type === 'output') {
        if ($( "#log" ).html() === "Running... ") {
            $( "#log" ).html("");
        }
        $( "#log" ).append("<div style=\"white-space: pre-wrap; font-family: monospace;\">" + receivedObject.data + "</div>");
    }
    if (receivedObject.type === 'error') {
        if ($( "#log" ).html() === "Running... ") {
            //console.log(000000000);
            $( "#log" ).html("");
        }
        //console.log(111);
        $( "#log" ).append("<div style=\"white-space: pre-wrap; font-family: monospace;\"><b style=\"color:#AA0000;font-size:15px;\">" + receivedObject.data + "</b></div>");
    }
    console.log("------error data----------");
    console.log(event.data);
};
ws.addEventListener('open', function (event) {
    ws.send(JSON.stringify({'type': 'connect', 'user': user.user}))
});
//tnt 监控
function TNTrepalce(){
    editor.find('46',{regExp: true});
    editor.replaceAll("41");
}
//blocks 监控
function blocksANT(){
    var x =[];
    for(var n=0;n<10;n++){
        var start  = editor.getValue().indexOf("setBlocks(",end);
        if (start === -1) return;
        var end = editor.getValue().indexOf(")",start);
        //console.log(start,end);
        var blocksStr =  editor.getValue().substring(start+10,end);
        var blocksTotal = blocksStr.split(",");
        //console.log(blocksTotal);
        for (var i=0;i<blocksTotal.length-1;i++) {
            if(blocksTotal[i].indexOf("pos")===-1){
                x[i]=parseInt(blocksTotal[i])
            }else{
                x[i]=parseInt(blocksTotal[i].substring(5));
                if (isNaN(x[i])===true) x[i] =0
            }
            //console.log(x[i]);
        };
        var total= Math.abs((x[3]-x[0])*(x[4]-x[1])*(x[5]-x[2]));
        //console.log(total);
        if (total > 125000) {
            $( "#log" ).html("Sorry...We can't support so many blocks, please try again. ");
            throw new Error("blocks stop");
        }
        var end = editor.getValue().indexOf(")",start);
    }
}
//while true: 监控
//while true: 监控
function wileTrueANT(){
    var ifTime = editor.find('import time', {
        wrap: true,
        caseSensitive: true,
        wholeWord: true,
        regExp: false,
        preventScroll: true // do not change selection
    });
    var ifWhile = editor.find('while True:', {
        wrap: true,
        caseSensitive: true,
        wholeWord: true,
        regExp: false,
        preventScroll: true // do not change selection
    });
    var ifSleep = editor.find('time.sleep(0.5)', {
        wrap: true,
        caseSensitive: true,
        wholeWord: true,
        regExp: false,
        preventScroll: true // do not change selection
    });
    console.log(ifTime);
    console.log(ifWhile);
    console.log(ifSleep);
    if (ifTime == null) {
        editor.gotoLine(0);
        editor.insert("import time" + '\n');
    }
    if (ifWhile !== null) {
        if (ifSleep == null) {
            console.log("add time.sleep");
            editor.find('while True:');
            editor.replaceAll('while True:' + '\n' + '    time.sleep(0.5)');
        } 
    } ;
};
//select your server
function getserver() {
    //* 选择server_list 确定往不同server发送python代码
    var selectedServer = $('#server-list').val();
    editor.find('minecraft\.Minecraft\.create\([^\)]*\)', {regExp: true});
    editor.replaceAll('minecraft.Minecraft.create(address = "' + ip + '", port = ' + selectedServer );
}
function runPythonScript() {
    var ifServer = editor.find('address = "localhost", port =', {
        wrap: true,
        caseSensitive: true,
        wholeWord: true,
        regExp: false,
        preventScroll: true // do not change selection
    });
    if (!ifServer) {
        $('.modal-alert .modal-header h4').text('Fail!');
        $('.modal-alert .modal-body p').html("Please select your server.");
        $('.modal-alert').modal('show');
       //alert("请选择服务器");
        return;
    }
    blocksANT();
    wileTrueANT();
    TNTrepalce();
    //console.log(editor.getValue());
    $( "#log" ).html("Running... ");
    var playerid = user.playerid;
    var selectedServer =$('#server-list').val();
    //editor.insert('myId = mc.getPlayerEntityId("' + playerid + '")\n' + "pos = mc.entity.getTilePos(myId)");
    var ifServer = editor.find('mc.getPlayerEntityId');
    //console.log(ifPos);
    if (!ifServer){
        //console.log(0);
       // editor.find('selectedServer');
        editor.find('minecraft\.Minecraft\.create\([^\)]*\)', { regExp: true });        
        //editor.insert('myId = mc.getPlayerEntityId("' + playerid + '") \n' + 'pos = mc.entity.getTilePos(myId');  
        editor.replaceAll('minecraft.Minecraft.create(address = "' + ip + '", port = ' + selectedServer + ') \n' +
            'myId = mc.getPlayerEntityId("' + playerid + '") \n' + 'pos = mc.entity.getTilePos(myId');
    
    }else{
        //console.log(1);
        //TNTrepalce();
        data = editor.getValue();
    }

    $.post("run", {"data":editor.getValue()},function( data ) {
        // do something

    });
}


function stopPython() {
    $( "#log" ).html("Stop");
    $.post("kill" ,function( data ) {
        data = "try: \n" +
            "   while True: break  \n" +
            "execpt: \n" +
            "   while True: break \n";
        // do something

    });
}

function getOption() {
    var obj = document.getElementById("selectList");
    if (obj.selectedIndex > 0) {
        document.getElementById("resulttitle").innerHTML = "<b>Your Minecraft 1.9.2 IP</b><br>";
    } else {
        document.getElementById("resulttitle").innerHTML = "";
    }
    //replaceIP();
}

function getLesson() {
    selectedID = $('#selectSampleCode').val();
    console.log(selectedID);
    //save();
    load();
    //setTimeout('getserver()',5000);
}

function save() {
      var name = prompt("", ""); 
      if (name)
      {
          alert("欢迎您：" + name)
      }
    selectedID = $('#selectSampleCode').val();
    var data = {
        "lesson":selectedID,
        "code":editor.getValue(),
        "time": new Date(),
        "name": name
    }
    $.post("home/save", data , function( data ) {
        console.log("Saved") 
    });
     console.log(1)
    setTimeout('editorModalAlert("Successfully Saved.")', 1000);
}

function load() {
    $.post("home/load", {"entry": ("save" + selectedID) + (teacherMode ? "teach" : "")}, function( data ) {
        console.log(data);
        if (data) {
            const selectedServer =$('#server-list').val();
            //console test
            //console.log("-----------------------");
            //console.log(selectedServer);
            editor.setValue(data);
        } else {
            console.log("load lesson template")
            loadLessonTemplate(selectedID, teacherMode);
            // editor.setValue(teacherMode ? lessonFinalForIndex(selectedIndex) : lessonTemplateForIndex(selectedIndex));
        }
    });
    //not now
    //setTimeout('editorModalAlert("Successfully Loaded.")', 1000);
}

function reset() {
    selectedID = $('#selectSampleCode').val();
    teacherMode = false;
    loadLessonTemplate(selectedID, teacherMode);
    // editor.setValue(teacherMode ? lessonFinalForIndex(selectedIndex) : lessonTemplateForIndex(selectedIndex));
}

function loadLessonTemplate(id, teacher) {
    console.log(id);
    const selectedServer =$('#server-list').val();
    if (id === "Template Code") {
        editor.setValue(`import mcpi.minecraft as minecraft
mc = minecraft.Minecraft.create()
mc.postToChat("Hello Minecraft World")
# Welcome to BiggerLab's Minecraft Python Editor`);
        //editor.find('minecraft\.Minecraft\.create\(.*\)',{regExp: true});
        //editor.replaceAll('minecraft.Minecraft.create(address = "' + ip + '", port = ' + selectedServer + ')');
        return;
    }
    $.post("templates", {"id": id, "teacher": teacher}, function( data ) {
        console.log(data);
        if (data) {
            editor.setValue(data);
            console.log(data)
        } else {
            editor.setValue("error template");
            console.log("error template")
            // error
        }
    });
}

function replaceIP() {
    var obj = document.getElementById("selectList");
    const selectedServer =$('#server-list').val();
    if (obj.selectedIndex > 0) {
        document.getElementById("result").innerHTML = ip + ":" + (25565 + obj.selectedIndex - 1);
        editor.find('minecraft\.Minecraft\.create\(.*\)',{regExp: true});
        editor.replaceAll('minecraft.Minecraft.create(address = "' + ip + '", port = ' + selectedServer + ')');
    } else {
        document.getElementById("result").innerHTML = "";
        editor.find('minecraft\.Minecraft\.create\(.*\)',{regExp: true});
        editor.replaceAll('minecraft.Minecraft.create()');
    }
}

function saveHint() {
    $.post("hints", {"data": secondEditor.getValue()}, function(data) {
        console.log(data);
    });
}

function loadHint() {
    $.get("hints", function(data) {
        secondEditor.setValue(data);
    });
}

function loadTemplates() {
    //$("#selectSampleCode").selectpicker("refresh", true);
    $.post("load_template_list", function(data) {
        //console.log(data);
        if (data) {
            var currentLesson = 0;
            var htmlToInsert = '';
            for (var i = 0; i < data.length; i++) {
                if (data[i]["lesson"] > currentLesson) {
                    currentLesson = data[i]["lesson"];
                    htmlToInsert += '<optgroup label="Lesson ' + currentLesson + '">';
                }
                htmlToInsert += '<option   value="' + data[i]["_id"].toString() + '">'+data[i]["title"]+'</option>';
                if (i + 1 >= data.length || data[i + 1]["lesson"] > currentLesson) {
                    htmlToInsert += '</optgroup>';
                }
            }
            $("#selectSampleCode").append(htmlToInsert);
            //$("#selectSampleCode").selectpicker("refresh",true);
        } else {
            // error
        }
    });
}

function changeToTemplate(teacher) {
    //console.log(teacher);
    //save();
    selectedID = $('#selectSampleCode').val();
    loadLessonTemplate(selectedID, teacher);
}
//
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
