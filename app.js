const express = require('express');
const session = require('express-session');
const app = express();

const port = 3002;
const path = require('path');
const flash = require('connect-flash');
const router = require('./src/router');
const TokenGenerator = require('uuid-token-generator');
const tokgen2 = new TokenGenerator(256, TokenGenerator.BASE62);

const { I18n } = require('i18n')
const fs = require("fs");
const md_path = __dirname + '/src/modules/';
const configs_datas = JSON.parse(fs.readFileSync('./config/config.json'));

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { config } = require('./config/database');
global.current_time = new Date().toLocaleString('en-US', {timeZone: 'Asia/Baku'});
global.token = tokgen2.generate();

const i18n = new I18n()

i18n.configure({
    locales: ['en','az','ru','tr'],
    directory: path.join(__dirname, 'languages'),
    defaultLocale: 'az',
    cookie: 'whCookieSecretName',
    register: global
})
// i18n.setLocale('en')
// console.log(__('hello'));

global.exist_modules = [];
if(Array.isArray(configs_datas.features)){
    configs_datas.features.forEach(v => {
        if (fs.existsSync(md_path+v)) global.exist_modules.push(v);
    });
}


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

app.use('/',router);


app.listen(port, () => {
    // console.log(`Example app listening at http://localhost:${port}`)
})