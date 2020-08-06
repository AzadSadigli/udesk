const fs = require('fs');
const db = require('./../../../../config/database.js');
const path = require("path");
const pth = '../modules/sales/views/';

let configs = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../../../config/config.json")));
let locals = {project_name: configs.project_name};

exports.addPage = (req, res) => {
    let sql = `SELECT p.*,
                (SELECT price FROM product_prices pp WHERE pp.product_id = p.id AND pp.deleted_at IS NULL ORDER BY id DESC LIMIT 1) as price 
                FROM products p WHERE p.deleted_at IS NULL`;
    db.query(sql,function(error,result){
        if(error){
            res.send(error);
        }else{
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            let def_val_date = now.toISOString().slice(0, -1);
            locals = Object.assign(locals,{
                title: 'Sales',
                link: 'sales',
                parentName: 'Sales',
                metaDescription: '',
                dashboard: 'dashboard',
                metaKeys: '',
                defualtDate: def_val_date,
                products: result,
                message: req.flash('message'),
                type: req.flash('type')
              });
            res.render(pth + 'add',locals)
        }
    });
}


exports.addSale = (req, res) => {
    let b = req.body;
    let list = {
        user_id:req.session.auth_user,
        product_id:b.product_id,
        per_price:b.per_price,
        sale_price:b.total_price,
        discount_rate:((((b.quantity * b.per_price) - b.total_price) / (b.quantity * b.per_price)) * 100).toFixed(2),
        quantity:b.quantity,
        // discount_code:discount_code,
        datetime:b.datetime,
        comment:b.comment,
    };

    if(!b.product_id || !b.total_price || !b.quantity || !b.datetime){
        let msg = (!b.product_id ? "'product'" : (!b.total_price ? "'total price'" : (!b.quantity ? "'quantity'" : "'datetime"))) + ' cannot be empty';
        req.flash('message',msg);
        req.flash('type','danger');
        return res.redirect('/sale/add')
    }
    db.query('INSERT INTO sales SET ?',list,function(error,result){
        if(error){
            // res.send(error);
            req.flash('message',error.message);
            req.flash('type','danger');
            return res.redirect('/sale/add')
        }else{
            req.flash('message','Sale added');
            req.flash('type','success');
            return res.redirect('/sale/add')
        }
    });
}


exports.salesList = (req, res) => {
    let sql = `SELECT sl.*,
                (SELECT name FROM products WHERE id = sl.product_id) as product,
                (SELECT CONCAT(name, ' ', surname) FROM users WHERE id = sl.user_id) as seller
                 FROM sales sl ORDER BY id DESC`;
    db.query(sql,function(error,result){
        if(error){
            res.send(error);
        }else{
            // const now = new Date();
            // now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            // let def_val_date = now.toISOString().slice(0, -1);
            locals = Object.assign(locals,{
                title: 'Sales',
                link: 'sales',
                parentName: 'Sales',
                metaDescription: '',
                dashboard: 'dashboard',
                metaKeys: '',
                // defualtDate: def_val_date,
                sales: result,
                message: req.flash('message'),
                type: req.flash('type')
              });
            res.render(pth + 'list',locals)
        }
    });
}