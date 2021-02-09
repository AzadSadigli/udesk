const fs = require('fs'),
    path = require('path');
const db = require('../../config/database.js');
const { reset } = require('nodemon');
const session = require('express-session');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const saltRounds = 10;

let configs = JSON.parse(fs.readFileSync(__dirname + '/../../config/config.json'));
let locals = {project_name: configs.project_name};

exports.testPage = (req, res) => {
    
}
