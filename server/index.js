var express = require('express'),
    // favicon = require('serve-favicon'),
    mongoose = require('mongoose'),
    http = require('http'),
    swig = require('swig'),
    bodyParser = require('body-parser'),
    serveStatic = require('serve-static'),
    cookieParser = require('cookie-parser');
    // compress = require('compression');
// ==================== Mongoose Connect ====================
var appConfig = require('./config.js');
// var beep = require('beepbeep');

// ====================  Environments ====================
//var env = process.env.ENV_VARIABLE || 'dev';

// connect to mongodb via mongoose
console.log('attempting mongodb connection');

mongoose.connect(appConfig.db.url);

// on failed mongoose connection
mongoose.connection.on('error', function(event){
    // beep();
    console.log('Application FAILED to connect to Mongo: 104.130.77.72:27017', event);
});

// on successfull connection
mongoose.connection.on('connected', function(){
    console.log('Application Connected to Mongo: 104.130.77.72:27017');

    // ====================  App Settings ====================
    var app = express();

    app.set('trust proxy', 1); // trust first proxy

    app.config = appConfig;
    app.set('db', this.db);
    app.engine('html', swig.renderFile);
    app.set('view engine', 'html');
    app.set('views', __dirname + '/../public');

    // Swig will cache templates for you, but you can disable
    // that and use Express's caching instead, if you like:
    app.set('view cache', false);
    // To disable Swig's cache, do the following:
    // swig.setDefaults({ cache: false });
    // NOTE: You should always cache templates in a production environment.
    // Don't leave both of these to `false` in production!

    // ==================== Enable Compression (gzip) ====================

    // app.use(compress());

    // ==================== Statics ====================

    // app.use(favicon(__dirname + './../public/assets/favicon.ico'));
    app.use('/', serveStatic(__dirname + './../public'));
    // app.use('/uploads', serveStatic(__dirname + './../../' + app.config.uploadDirectory));

    // ====================  PING FED REDIRECT ====================

    app.get('/test', function(req,res,next){
        res.json(req.headers);
    });

    // ==================== Parsers ====================

    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({
      extended: true
    }));

    app.use(cookieParser());

    // ====================  SCHEMAS ====================

    app.mongoose = mongoose;
    app.Models = require('./schemas/schemas.js')(app);

    // augment User Model
    require('./schemas/user-score.js')(app);

    // ====================  AUTH ====================

    // binds auth middleware
    // after success, req.authenicated should be true
    // and req.user should be populated
    require('./auth.js')(app);

    // ====================  API ====================

    require('./api/comments.js')(app);
    require('./api/feedback.js')(app);
    require('./api/ideas.js')(app);
    require('./api/search.js')(app);
    require('./api/users.js')(app);
    require('./api/upload.js')(app);
    require('./api/history.js')(app);

    // ====================  Routes & Templates ====================
    require('./routes.js')(app);

    // ====================  Starting Port ====================
    http.Server(app).listen(8000, function(){
        console.log('listening on *:8000');
    });
});
