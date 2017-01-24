'use strict';
var environment = process.env.ENVIRONMENT || "local";

module.exports = {
    port: process.env.PORT || 8000,
    privateKey: process.env.PRIVATE_KEY || '01234567890123456789012345678901',
    test: process.env.TEST || false,
    encryptionAlgorithm: 'aes-256-ctr',
    userSessionCookieName: process.env.USER_SESSION_COOKIE_NAME || 'crowdSessionCookie',
    environment: environment,
    localUser: process.env.LOCAL_USER || 'z000000',
    db: (function(){

        var config = {
            url: 'mongodb://crowdUser:wwgF6zuQuJQxTjy2@162.242.174.37:27017/crowd?connectTimeoutMS=8000'
        };

        if(environment !== 'production'){
            config.url = 'mongodb://crowdDevUser:UppQAXQFrFfCWGQ8@162.242.174.37:27017/crowdDev?connectTimeoutMS=8000';
        }

        return config;
    })(),
    uploadDirectory: (function(){
        var dir = 'Crowd-Content';
        if(environment !== 'production'){
            dir = 'CrowdContentDev';
        }

        return dir;
    })(),
    schemaToJSONOptions: {
        versionKey: false,
        transform: function(doc, ret, options){
            ret.id = ret._id;
            delete ret._id;
        },
        virtuals: true
    },
    schemaToObjectOptions: {
        versionKey: false,
        transform: function(doc, ret, options){
            ret.id = ret._id;
            delete ret._id;
        },
        virtuals: true
    },
    imageUploadDirectory: '/../../Crowd-content/',
    userWhitelist: [
        'z086579', // Al
        'z0019x4', // Kyle
        'z001bmz', // Peter
        'z067106', // Brad
        'z042690', // Donnie
        'z013k7x', // Brice
        'a534430', // Ted
        'z078199', // Namue
        'z069846', // Mark
        'z001fyb', // Nate
        'a522970', // Carmen,
        'z013hfg', // Nick Crumholz,
        'z085673', // Jack Sparrow
        'z013mtv', // Jafar
        'a558360', // Matt Nesbitt
        'z075588', // Jamil.Ghani
        'z014040', // Rachel Anderson
        'z081063', // Matthew Williams
        'z071232', // Andrew.Einhaus
        'z013S6v', // Ted.Prendergast
        'z013m65', // Anne.Mezzenga
        'z081818', // Bjorn.Larson
        'tjug422'  // Stef.Bell;

    ]
};
