'use strict';

module.exports = function(app) {

    var indexHandler = function(req,res,next){

        var user = req.user.toJSON();

        var manifest = {
            user: user,
            appConfig: {
                apiBasePath: '',
                environment: app.config.environment,
                userPoints: app.Models.User.points
            }
        };

        res.render('index', { manifest: JSON.stringify(manifest) });
    };

    // app.get('/*', indexHandler.bind(this));
    app.get('*', function(req, res) {
        res.sendFile(__dirname + '/tmp/index.html');
    });


    app.use(function(err, req, res, next) {
        if(err.status === 404) {
            res.render('404');
        } else if(err.status === 401){
            res.render('401', { err: err.message });
        } else {
            console.log('last 500 - you didn\'t catch an error');
            res.render('500');
        }
    });
};
