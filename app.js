const express = require('express');
const session = require('express-session');
const app = express();

const port = 3002;
const path = require('path');
const flash = require('connect-flash');
const router = require('./src/router');
const TokenGenerator = require('uuid-token-generator');
const tokgen2 = new TokenGenerator(256, TokenGenerator.BASE62);


const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const i18next = require('i18next');
const i18nextMiddleware = require('i18next-express-middleware');
const Backend = require('i18next-node-fs-backend');

global.current_time = new Date().toLocaleString('en-US', {timeZone: 'Asia/Baku'});
global.token = tokgen2.generate();


i18next.use(Backend).use(i18nextMiddleware.LanguageDetector)
.init({
  backend: {loadPath: __dirname + '/config/languages/{{lng}}/{{ns}}.json'},
  detection: {order: ['querystring', 'cookie'],caches: ['cookie']},
  fallbackLng: 'en',
  preload: ['en', 'ru']
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());

app.use(session({
    secret: 'newSecretOfSystem2364',
    cookie: {
        // secure: true,
        maxAge:600000
    },
    resave: false,
    saveUninitialized: false,
}));

app.use(flash());

app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');
app.use(express.static('./views'));
app.use('/assets',express.static('./assets'));

global.slugify = function(txt){
    text = txt.replace('ə','e').replace('ş','sh').replace('ç','ch')
                .replace('ö','o').replace('ü','u').replace('Ə','e')
                .replace('Ş','sh').replace('Ç','ch').replace('Ö','o')
                .replace('Ü','u');
    return text.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
}

// global.getRandomNumbers = function() {
//     return (new Date().getTime()).toString(36) + new Date().getUTCMilliseconds();
// }

app.use('/',router);


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))