$("document").ready(function(){
    commandTool.onLoad();
});
var xhr;
commandTool = {
    //socket: undefined,
    userID: 0,
    fileName: "",
    arrCommands: [],
    counter: 0,
    currentIndex: 0,
    list:[],
    onLoad: function () {
        $("#fileUploader").change(function() {
            commandTool.uploadFile();
        });
    },
    completedCallback: function(){
        if(commandTool.currentIndex>=commandTool.list.length){
            // do nothing
            setTimeout(function(){
                commandTool.currentIndex = 0;
                commandTool.completedCallback();
            }, 10000);
        }
        else{
            $(commandTool.list[commandTool.currentIndex]).trigger('click');
        }
        commandTool.currentIndex++;
    },
    loadStatus: function () {
        // /widgets/commandTool/status.json
        d3.json("/ct/widgets/commandTool/status.json", function (error, json) {
            if (error)
                return console.log(error);
            //console.log(json);

            function clicked(index, operation, output) {
                //$('#statusDiv tr td div').empty();
                output.empty();
                output.append('<div style="width:100%">');
                output.find("div:last").text("waiting for output ... ").css('color', 'red');
                console.log(index, operation, json[index], output);
                commandTool.runCommand(json[index][operation], output);
            }

            function bindEvent(source, x, operation, output) {
                source.on('click', function (e) {
                    $(e.target).after(output);
                    clicked(x, operation, output);
                });
            }
            function prepare(x) {
                var ul = $('<ul>');
                var li = $('<li>');
                li.append('<div class="result"><div style="width: 100%; color: red;">waiting for output</div></div>');
                li.append('<span>' + json[i].Name + '</span>');
                ul.append(li);

                li = $('<li>');
                li.append('<a class="status">Status<a/>');
                bindEvent(li.find('a'), x, "Check", ul.find('div.result'));
                ul.append(li);

                li = $('<li>');
                li.append('<a>Start<a />');
                bindEvent(li.find('a'), x, "Start", ul.find('div.result'));
                ul.append(li);

                li = $('<li>');
                li.append('<a>Stop<a/>');
                bindEvent(li.find('a'), x, "Stop", ul.find('div.result'));
                ul.append(li);

                li = $('<li>');
                li.append('<a>Restart <a/>');
                bindEvent(li.find('a'), x, "Restart", ul.find('div.result'));
                ul.append(li);

                $('#statusDiv').append(ul);
            }
            for (var i = 0; i < json.length; i++) {
                prepare(i);
            }
            commandTool.list = $(".status");
            commandTool.completedCallback();
        });
    },
    runCommand: function (command, selector) {
        if (typeof selector == 'string')
            selector = $(selector);
        //selector.children().remove();
        commandTool.counter = 0;
        var allCommands = commandTool.arrCommands.join('\n');
        var command = command.trim();
        if (allCommands.length > 0) {
            command = allCommands + '\n' + command;
        }
        if (command.length > 0) {
            //commandTool.socket.emit('execCommand', command);
            var client = new XMLHttpRequest();
            client.onreadystatechange = function () {
                if (client.readyState == 4 && client.responseText != "") {
                    selector.empty();
                    console.log("Data:" + client.responseText);
                    var responseText = JSON.parse(client.responseText);
                    selector.append('<div style="width:100%;margin-top:5px;">');
                    selector.find("div:last").text("");
                    for (var i = 0; i < responseText.length; i++) {
                        var key = Object.keys(responseText[i])[0];
                        if (key == 'close') {
                            var data = responseText[i][key].split('\n');
                            for (var j = 0; j < data.length; j++) {
                                selector.append('<div style="width:100%">');
                                selector.find("div:last").text(data[j]).css('color', 'green');
                            }
                            selector.scrollTop(selector[0].scrollHeight);
                        }
                        else if (key == 'stdout') {
                            var data = responseText[i][key].split('\n');
                            for (var j = 0; j < data.length; j++) {
                                selector.append('<div style="width:100%">');
                                selector.find("div:last").text(data[j]).css('color', 'black');
                            }
                            selector.scrollTop(selector[0].scrollHeight);

                        }
                        else if (key == 'stderr') {
                            var data = responseText[i][key].split('\n');
                            for (var j = 0; j < data.length; j++) {
                                selector.append('<div style="width:100%">');
                                selector.find("div:last").text(data[j]).css('color', 'red');
                            }
                            selector.scrollTop(selector[0].scrollHeight);
                        }
                    }
                    selector.append('<div style="width:100%;margin-top:5px;margin-bottom:10px;">');
                    selector.find("div:last").text("");
                    commandTool.completedCallback();
                }
            };
            client.open("get", "/ct/execCommand/" + encodeURIComponent(command), true);
            client.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            client.setRequestHeader("Content-Type", "text/json");
            client.send(JSON.stringify({command: command}));
        }
        else {
            alert('Command name is required.');
        }
    },
    uploadFile: function(){
        if(typeof xhr === "object" && typeof xhr.abort === "function"){
            xhr.abort();
        }
        var file = $("#fileUploader")[0].files[0],
            name = file.name,
            size = file.size;

        xhr = new XMLHttpRequest();
        xhr.upload.onprogress = function (e) {
            if (e.lengthComputable) {
                //console.log(e.loaded, "uploaded from ", e.total);
                $("#uploadStatus").text(parseInt(e.loaded*100/e.total) + "% uploaded from "+e.total+" bytes.");
            }
        };

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                $("#uploadStatus").text(xhr.responseText);
            }
        };

        xhr.open("POST", "/ct/fileUpload", true);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.setRequestHeader("X-File-Name", encodeURIComponent(name));
        xhr.setRequestHeader("X-File-Name-Display", name);
        xhr.setRequestHeader("Content-Type", "application/octet-stream");
        xhr.send(file);
    }
}
