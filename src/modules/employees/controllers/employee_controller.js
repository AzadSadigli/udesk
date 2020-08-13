const fs = require('fs');
const db = require('./../../../../config/database.js');
const path = require("path");
const pth = '../modules/employees/views/';

let configs = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../../../config/config.json")));
let locals = {project_name: configs.project_name};

exports.addPage = (req, res) => {
    locals = Object.assign(locals,{
        title: 'Employee',
        link: 'employee',
        metaDescription: '',
        metaKeys: '',
        message: req.flash('message'),
        type: req.flash('type')
      });
    res.render(pth + 'add',locals)
}

function firstFunction() {
    return new Promise((resolve, reject) => {
        
    })
  }
  
  //2. Create an async function
async function getMainID() {
    return await getMainIDFirst()
}; 


function getMainIDFirst() {
    return new Promise((resolve, reject) => {
        let key = Math.ceil(Math.random()*10000000000);
        db.query('SELECT * FROM products WHERE main_id = ?', [key], function (err, rows) {
            if(err){
                getMainID();
            }else{
                if(rows.length){
                    getMainID();
                }else{
                    return key;
                }
            }
        });
        return key;
    });
}

exports.addEmployee = (req, res) => {
    let {barcode,name,price,quantity} = req.body;
    let slug = slugify(name),
        main_id = getMainID();

    let list = {
        slug: slug + '-' + main_id,
        barcode: barcode,
        name: name,
        main_id: main_id,
        user_id: req.session.auth_user
    };
    if(!name || !barcode || !price || !quantity){
        let msg = (!name ? "'name'" : (!barcode ? "'barcode'" : (!price ? "'price" : "'quantity'"))) + ' cannot be empty';
        req.flash('message',msg);
        req.flash('type','danger');
        return res.redirect('/employee/add')
    }
    db.query(`INSERT INTO employees SET ?`,list,function(error,result){
        if(error){
            req.flash('message',error.message);
            req.flash('type','danger');
            return res.redirect('/employee/add')
        }else{
            req.flash('message','Successfully added!');
            req.flash('type','success');
            return res.redirect('/employee/add')
        }
    });
}


exports.employeesList = (req,res) => {
    let sql = `SELECT * FROM employees ORDER BY id DESC`;
    db.query(sql,function(error,result){
        if(!error){
            locals = Object.assign(locals,{
                title: 'Employee',
                link: 'employee',
                metaDescription: '',
                metaKeys: '',
                message: req.flash('message'),
                type: req.flash('type'),
                products: result
              });
            res.render(pth + 'list',locals);
        }else{
            res.send(error);
        }
    });
    
}