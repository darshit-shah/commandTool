exports.fetchQueryResultAsStream = function (strQuery) {
    var stream = require("stream");
    var util = require('util');

    function StringifyStream(options) {
        if (!(this instanceof StringifyStream))
            return new StringifyStream(options);

        options = options || {};
        options.objectMode = true;

        stream.Transform.call(this, options);
    }

    util.inherits(StringifyStream, stream.Transform);

    StringifyStream.prototype._transform = function (d, e, callback) {
        this.push(JSON.stringify(d));
        callback();
    };


    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: '54.251.110.52',
        user: 'usr',
        password: 'usr',
        database: 'axiomACC'
    });

    connection.connect();
    var query = connection.query(strQuery).stream({ highWaterMark: 5 });
    return query.pipe(StringifyStream());
}

exports.filterStreamData = function (filters) {
    var Transform = require('stream').Transform;
    var parser = new Transform();
    parser._transform = function (data, encoding, done) {
        //console.log(data.toString());
        var json = JSON.parse(data);
        var filterPassed = true;
        for (var i = 0; i < filters.length && filterPassed == true; i++) {
            if (filters[i].type == 'in') {
                var found = false;
                for (var valIndex = 0; valIndex < filters[i].values.length && found == false; valIndex++) {
                    if (json[filters[i].name] == filters[i].values[valIndex]) {
                        found = true;
                        break;
                    }
                }
                if (found == false) {
                    filterPassed = false;
                    break;
                }
            }
            else if (filters[i].type == 'contains') {
                var found = false;
                for (var valIndex = 0; valIndex < filters[i].values.length && found == false; valIndex++) {
                    if (json[filters[i].name].indexOf(filters[i].values[valIndex]) != -1) {
                        found = true;
                        break;
                    }
                }
                if (found == false) {
                    filterPassed = false;
                    break;
                }
            }
        }
        if (filterPassed == true) {
            this.push(data);
        }
        done();
    }
    parser._flush = function (done) {
        done();
    }
    return parser;
    //return inputStream.pipe(parser);
}

exports.bundleStreamData = function () {
    var Transform = require('stream').Transform;
    var parser = new Transform();
    var started = false;
    parser._transform = function (data, encoding, done) {
        if (started == false) {
            started = true;
            this.push("[" + data);
        }
        else {
            this.push("," + data);
        }
        done();
    }
    parser._flush = function (done) {
        this.push(']');
        done();
    }
    //return inputStream.pipe(parser);
    return parser;
}

exports.fetchQueryResultAsStream('SELECT * FROM tbl_usermaster;').pipe(exports.filterStreamData([{ name: 'email', type: 'contains', values: ['acclimited.com']}])).pipe(exports.filterStreamData([{ name: 'pk_UserID', type: 'in', values: [600, 601]}])).pipe(exports.bundleStreamData()).pipe(process.stdout);
