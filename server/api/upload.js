'use strict';

var fs = require('fs');
var mkdirp = require('mkdirp');

module.exports = function(app) {

    //POST: post an image
    app.post('/api/upload/image', function(req, res) {

        var image = new Buffer(req.body.base64Data.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');

        // var imageExt = '.' + req.body.extension;

        var date = new Date();

        var dirUrl = '/' + date.getFullYear() + '/';
        dirUrl += (date.getMonth() < 10) ? '0' + date.getMonth().toString() : date.getMonth();
        dirUrl += '/' + (date.getDate() < 10 ? '0' + date.getDate().toString() : date.getDate());

        var imageUrl = dirUrl + '/' + date.getTime(); // + imageExt;

        var fileUrl = __dirname + '/../../../' + app.config.uploadDirectory + imageUrl + '.jpg';
        var clientUrl = '/uploads' + imageUrl + '.jpg';

        var onCreateDirectory = function(){
            fs.writeFile(fileUrl, image, 'base64', function (err) {

                if(err) {
                    return res.status(500).json(err);
                }

                res.json({
                    id: date.getTime(),
                    url: clientUrl
                });
            });
        };

        mkdirp(__dirname + '/../../../' + app.config.uploadDirectory + dirUrl, null, onCreateDirectory.bind(this));
    });
};
