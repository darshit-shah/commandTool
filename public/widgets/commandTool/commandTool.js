commandTool = {
    //socket: undefined,
    userID: 0,
    fileName: "",
    arrCommands: [],
    counter: 0,
    onLoad: function () {
    },
    loadStatus: function () {
        // /widgets/commandTool/status.json
        d3.json("/widgets/commandTool/status.json", function (error, json) {
            if (error) return console.log(error);
            //console.log(json);
            function clicked(index, operation, output) {
                $('#statusDiv tr td div').empty();
                //output.text("Processing");
                console.log(index, operation, json[index], output);
                commandTool.runCommand(json[index][operation], output);
            }

            function bindEvent(source, x, operation, output) {
                source.on('click', function () {
                    clicked(x, operation, output);
                });
            }
            function prepare(x) {
                var tr = $('<tr>');
                var td = $('<td>');
                td.append('<span>' + json[i].Name + '</span>');
                tr.append(td);

                td = $('<td>');
                td.append('<input type="button" value="Check" style="float:left" /><div style="float:left"></div>');
                bindEvent(td.find('input'), x, "Check", td.find('div'));
                tr.append(td);

                td = $('<td>');
                td.append('<input type="button" value="Start" style="float:left" /><div style="float:left"></div>');
                bindEvent(td.find('input'), x, "Start", td.find('div'));
                tr.append(td);

                td = $('<td>');
                td.append('<input type="button" value="Stop" style="float:left" /><div style="float:left"></div>');
                bindEvent(td.find('input'), x, "Stop", td.find('div'));
                tr.append(td);

                td = $('<td>');
                td.append('<input type="button" value="Restart" style="float:left" /><div style="float:left"></div>');
                bindEvent(td.find('input'), x, "Restart", td.find('div'));
                tr.append(td);

                $('#statusDiv').append(tr);
            }
            for (var i = 0; i < json.length; i++) {
                prepare(i);
            }
        });
    },
    runCommand: function (command, selector) {
        if (typeof selector == 'string')
            selector = $(selector);
        selector.children().remove();
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
                    console.log("Data:" + client.responseText);
                    var responseText = JSON.parse(client.responseText);
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
                }
            };
            client.open("get", "/ct/execCommand/" + encodeURIComponent(command), true);
            client.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            client.setRequestHeader("Content-Type", "text/json");
            client.send(JSON.stringify({ command: command }));
        }
        else {
            alert('Command name is required.');
        }
    }
}
