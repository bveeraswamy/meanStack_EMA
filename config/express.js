var config = require('./config')
    express = require('express'),
    morgan = require('morgan'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    passport = require('passport'),
    flash = require('connect-flash');

 module.exports = function(){
    var EMApp = express();

        if (process.env.NODE_ENV === 'development'){
            EMApp.use(morgan('dev'));
        }else if ( process.env.NODE_ENV === 'production'){
            EMApp.use(compress());
        }

        EMApp.use(bodyParser.urlencoded({
            extended: true
        }));

        EMApp.use(bodyParser.json());
        EMApp.use(methodOverride());

        EMApp.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret
        }));

        EMApp.use(express.static('./public'));
        EMApp.set('views','./app/views');
        EMApp.set('view engine', 'ejs');

        EMApp.use(flash());
        EMApp.use(passport.initialize());
        EMApp.use(passport.session());

        require('../app/routes/EMA.server.routes')(EMApp);
        require('../app/routes/users.server.routes')(EMApp);
        require('../app/routes/articles.server.routes.js')(EMApp);
        return EMApp;
 }
 