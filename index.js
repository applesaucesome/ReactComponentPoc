var express = require('express'),
    http = require('http'),
    app = express();

var serveStatic = require('serve-static');

// app.use('/', express.static(__dirname + '/tmp'));

app.use('/', serveStatic(__dirname + '/'));

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/tmp/index.html');
});

// ====================  Starting Port ====================
http.Server(app).listen(8000, function() {
    console.log('listening on *:8000');
});
