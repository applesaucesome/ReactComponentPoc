'use strict';

var Crypto = require('crypto');

module.exports = function(app) {

    app.use(function(req,res,next){
        req.isAuthorizedUser = function(userId){
            if(!req.isAdmin && userId.toString() !== req.user.id){
                return false;
            }
            return true;
        };
        next();
    });

    app.get('/user/:id', function(req,res,next){
        req.overrideUser = req.params.id;
        next();
    });

    // redirect or error of there is no auth cookie
    var checkForAuthRedirect = function(req, res, next){

        req.authenticated = false;
        //var acceptHeaderRegex = /^([^\/]+)\/json/;
        req.isAPIRequest = req.url.indexOf('/api/') !== -1; //req.method !== 'GET' || acceptHeaderRegex.exec(req.headers.accept);
        req.isLoginURL = req.url === '/index.php';
        req.userSessionCookie = req.cookies[app.config.userSessionCookieName];

        // temporary until ping fed stops locking users
        if(req.overrideUser){
            return next();
        }

        if(!req.userSessionCookie && !app.config.test){

            if(req.isAPIRequest){

                res.status = 401;
                return res.sendStatus(401);

            } else if(!req.isLoginURL){

                // save redirect url
                res.cookie('pingFederateDeepLink', req.url);
                return res.redirect('http://' + req.get('Host') + '/index.php');
            }

            return next();
        }

        // you have a cookie, you may pass
        return next();
    };

    app.use(checkForAuthRedirect.bind(this));


    // at this point we either:
    // - have a cookie set already
    // - are at index.php in a lower environment and need to create a cookie
    // - are at index.php from pingfed and need to create a cookie
    var decipherAuthCookie = function(req, res, next){

        // TODO This is for testing purposes. Change before production ready
        if(req.overrideUser){

            // lower environment
            req.targetId = req.overrideUser;
            return next();
        }

        else if(req.userSessionCookie){

            // have cookie set already
            var decipher = Crypto.createDecipher(app.config.encryptionAlgorithm, app.config.privateKey);
            req.targetId = decipher.update(req.userSessionCookie, 'hex', 'utf8');
            req.targetId += decipher.final('utf8');

            return next();

        } else if(app.config.environment !== 'production'){

            req.targetId = app.config.localUser;
            return next();

        } else {

            // production /index.php back from ping
            req.targetId = req.headers.pf_auth_lanid;
            return next();
        }
    };

    app.use(decipherAuthCookie.bind(this));

    // Get the user from our DB or create one
    var getUser = function(req, res, next){

        req.targetId = req.targetId.toLowerCase();

        // temporary
        // check prod whitelist
        if(app.config.environment === 'production' && app.config.userWhitelist.indexOf(req.targetId) === -1){
            // you aren't allowed in yet
            var error = new Error();
            error.status = 401;
            return next(error);
        }

        // find a user
        app.Models.User.findOne({ targetId: req.targetId }, function(err, doc){

            if(err) {
               return next(new Error(500));
            }

            if(!doc){

                // CREATE A NEW USER HERE
                var newUser = {
                    targetId: req.targetId.toLowerCase(),
                    email: req.headers['pf_auth_e-mail'] || '',
                    firstName: req.headers.pf_auth_firstname || '',
                    lastName: req.headers.pf_auth_lastname || '',
                    jobTitle: req.headers.pf_auth_jobtitle || ''
                };

                newUser.email = newUser.email.toLowerCase();
                newUser.screenName = newUser.firstName + ' ' + newUser.lastName;

                var user = new app.Models.User(newUser);

                user.save(function(err, doc){

                    if(err) {
                        return next(new Error(500));
                    }

                    req.authenticated = true;
                    req.user = doc;
                    return next();
                });

            } else {
                req.authenticated = true;
                req.user = doc;
                return next();
            }
        });
    };

    app.use(getUser.bind(this));

    var setUserSessionCookie = function(req, res, next){

        req.isAdmin = req.user.roles.indexOf('admin') !== -1;

        // if you've authenticated but you don't have a cookie set
        if(req.authenticated && (!req.userSessionCookie || req.overrideUser)){

            var cipher = Crypto.createCipher(app.config.encryptionAlgorithm, app.config.privateKey);
            var cookie = cipher.update(req.targetId, 'utf8', 'hex');
            cookie += cipher.final('hex');
            res.cookie(app.config.userSessionCookieName, cookie);

            if(!app.config.test){
                var deepLinkCookie = req.cookies['pingFederateDeepLink'];
                var url = deepLinkCookie || '/';

                return res.redirect('http://' + req.get('Host') + url);
            }
        }

        return next();
    };

    app.use(setUserSessionCookie.bind(this));
};
