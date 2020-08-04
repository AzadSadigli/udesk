const fs = require('fs');
const db = require('../../config/database.js');
const { reset } = require('nodemon');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const session = require('express-session');
const saltRounds = 10;
var sess;

let configs = JSON.parse(fs.readFileSync('./config/config.json'));
let locals = {project_name: configs.project_name};

exports.loginPage = (req, res) => {
    let sql = 'SELECT * FROM `users`';
    db.query(sql,(err,result) => {
        if(err) throw err;
        locals = Object.assign(locals,{
            title: 'Login',
            link: 'login',
            metaDescription: '',
            metaKeys: '',
            message: req.flash('message'),
            type: req.flash('type')
          });
        res.render('auth/login',locals)
    })
}

exports.profilePage = (req, res) => {
    let sql = 'SELECT * FROM `users` WHERE email = ? ';
    db.query(sql,[req.session.email],(err,result) => {
        if(err) throw err;
        locals = Object.assign(locals,{
            title: result[0].name + ' ' + result[0].surname,
            link: 'profile',
            metaDescription: '',
            metaKeys: '',
            user: result[0],
            message: req.flash('message'),
            type: req.flash('type')
          });
        res.render('profile',locals)
    })
}

exports.registerPage = (req, res, next) => {
    let sql = 'SELECT * FROM `users`';
    db.query(sql,(err,result) => {
        if(err) throw err;
        locals = Object.assign(locals,{
            title: 'Register user',
            link: 'registerUser',
            metaDescription: '',
            metaKeys: '',
            message: req.flash('message'),
            type: req.flash('type')
          });
        res.render('auth/register_user',locals)
    });
}


exports.logout = (req,res) => {
    sess = req.session;
    sess.destroy((err) => {
        if(err) {return console.log(err);}
        return res.redirect('/login');
    });
}


exports.loginAction = (req,res) => {
    let {email,password} = req.body;
    if(!email || !password){
        let msg = (!email ? "'email'" : "'password'") + ' cannot be empty';
        req.flash('message',msg);
        req.flash('type','danger');
        return res.redirect('/login')
    }
    db.query("SELECT * FROM `users` WHERE email = ?", [email], function (error, results) {
        if(error){
            req.flash('message',error.message);
            req.flash('type','danger');
            return res.redirect('/login');
        }else{
            if(results.length > 0){
                bcrypt.compare(password, results[0]['password'], function (pass_check_err, pass_check_res) {
                    if (pass_check_res) {
                        sess = req.session;
                        sess.email = results[0]['email'];
                        sess.auth_user = results[0]['id'];
                        sess.name = results[0]['name'];
                        sess.surname = results[0]['surname'];

                        req.flash('message','Logged in');
                        req.flash('type','success');
                        return res.redirect('/profile');
                    } else {
                        req.flash('message','Incorrect password');
                        req.flash('type','danger');
                        return res.redirect('/login');
                    }
                });
            }else{
                req.flash('message','No user found');
                req.flash('type','danger');
                return res.redirect('/login');
            }
        } 
     });
}


exports.registerUser = (req, res, next) => {
    let token = global.token,
        $_rd_link = '/employee/add';
    let {name,surname,email,password,password_confirm} = req.body;
    if(!name || !surname || !email || !password || !password_confirm){
        let msg = (!name ? "'name'" : (!surname ? "'surname'" : (!email ? "'email'" : (!password ? "'password'" : "'password confirm'")))) + ' cannot be empty';
        req.flash('message',msg);
        req.flash('type','danger');
        return res.redirect($_rd_link)
    }
    if(password !== password_confirm){
        req.flash('message','Confirm password does not match');
        req.flash('type','danger');
        return res.redirect($_rd_link)
    }
    bcrypt.hash(password, saltRounds,function (err, password) {
        let new_list = {name,surname,email,token,password};
        db.query(`INSERT INTO users SET ?`,new_list,function(error,succ){
            if(error){
                req.flash('message',error.message);
                req.flash('type','danger');
                return res.redirect($_rd_link)
            }else{
                req.flash('message','Successfully added!');
                req.flash('type','success');
                return res.redirect($_rd_link)
            }
        });
    });

}