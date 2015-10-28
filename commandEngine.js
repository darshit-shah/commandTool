var express = require('express');
var connect = require('connect');
var fs = require('fs');
var app = module.exports = express.createServer();

var MemoryStore = express.session.MemoryStore;
var store = new MemoryStore();

app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({ store: store, secret: 'Th!$!$$@mple', key: 'sid' })); //Th!$!$$@mple
    //app.use(app.router);
    app.use(function (req, res, next) {
    	if(req.url.substring(0,2)=="//")
    	{
    	    req.url = req.url.substring(1);
    	}
        console.log(req.url);
        if (req.url.indexOf('/ct') == 0)
            req.url = req.url.substring(3);
        console.log(req.url);
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Methods", "POST, GET");
        if (req.url.toLowerCase().indexOf('/.svn/') == -1) {
            next();
        }
        else {
            res.sed('page not found');
        }
    });
    app.use(express.static(__dirname + '/public'));
});

var spawn = null;
var sh = null;

//handles application-wide uncaught exception
process.on('uncaughtException', function (err) {
    console.log('axiom uncaughtException in app.js');
});

app.on('close', function () {
    console.log('close');
});

process.on('exit', function () {
    console.log('About to exit.');
});

app.get('/execCommand/:cmd?', function (req, res) {
    console.log([req.body, req.params, req.query]);

    var strQuery = decodeURIComponent(req.params.cmd);
    //console.log(strQuery);
    var arrOutput = [];
    fs.writeFileSync('myCommand.sh', strQuery);
    if (sh != null) {
        //sh.kill('SIGTERM');
    }
    spawn = require('child_process').spawn;
    sh = spawn('sh', ['myCommand.sh']);
    //sh = spawn('myCommand.sh');

    //socket.emit('close', 'Process id: '+sh.pid);
    arrOutput.push({ 'close': 'Process id: ' + sh.pid });
    console.log(sh.pid.toString());
    //res.write({type:'start', data:sh.pid});

    sh.stdout.on('data', function (data) {
        //res.write({type:'stdout', data:data});
        console.log(data.toString());
        //socket.emit('stdout', data.toString());
        arrOutput.push({ 'stdout': data.toString() });
    });

    sh.stderr.on('data', function (data) {
        //res.write({type:'stderr', data:data});
        //socket.emit('stderr', data.toString());
        arrOutput.push({ 'stderr': data.toString() });
        console.log(data.toString());
    });

    sh.on('close', function (code) {
        //socket.emit('close', 'Exit with code: '+code);
        //res.write({type:'close', data:code});
        console.log(code.toString());
        arrOutput.push({ 'close': 'Exit with code: ' + code });
        res.json(arrOutput);
        sh = null;
        spawn = null;
    });
});

app.post('/fileUpload', function (req, res) {
    var tmp_path = req.header('X-File-Name-Display');
    tmp_path = tmp_path;
    var target_path = '/tmp/' + tmp_path;
    var stream = fs.createWriteStream(target_path);//, { flags: 'w', encoding: null, mode: 0666 }
    req.on('data', function (data) {
        stream.write(data);
    });
    req.on('end', function () {
        stream.end();
        stream.destroy();
        res.contentType('text/html');
        res.send("file uploaded successfully");
    });
});

app.listen(3012, function () {
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
