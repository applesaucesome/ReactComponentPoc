var express = require('express'),
    http = require('http'),
    app = express();

    app.use('/', express.static(__dirname + '/'));


// ====================  Starting Port ====================
http.Server(app).listen(8000, function(){
    console.log('listening on *:8000');
});