const fs = require('fs');
const db = require('../../config/database.js');

let configs = JSON.parse(fs.readFileSync('./config/config.json'));
let locals = {project_name: configs.project_name};

exports.list = (req, res) => {
    let sql = 'SELECT * FROM `users`';
    db.query(sql,(err,result) => {
        if(err) throw err;
        locals = Object.assign(locals,{
            title: 'Employees',
            link: 'employees',
            metaDescription: 'Page Description',
            metaKeys: 'Page Header',
            users: result
          });
        //   console.log(result);
        res.render('employees',locals)
    })
    
}