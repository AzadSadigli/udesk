const express = require('express');
const router = express.Router();
const {auth,no_auth} = require('./middlewares/auth');

const homeController = require('./controllers/home_controller');
const userController = require('./controllers/user_controller');
const testController = require('./controllers/test_controller');

const md = './modules/';const co = '/controllers/';
const authController = require(md + 'auth'+co+'auth_controller');
const productController = require(md + 'products'+co+'product_controller');
const salesController = require(md + 'sales'+co+'sales_controller');
const invoicesController = require(md + 'invoices'+co+'invoices_controller');
const employeesController = require(md + 'employees'+co+'employee_controller');



router.get('/',auth,homeController.getHome);
router.get('/table',auth,homeController.getTable);
router.get('/tabs',auth,homeController.getTabs);


// sales routes
router.get('/sale/add',auth,salesController.addPage); 
router.post('/sale/add',auth,salesController.addSale);
router.get('/sale/list',auth,salesController.salesList);
router.get('/sale/check-barcode',auth,salesController.checkBarcode);

// invoices routes
router.get('/invoice/add',auth,invoicesController.addPage); 
router.post('/invoice/add',auth,invoicesController.addInvoice);
router.get('/invoice/list',auth,invoicesController.invoicesList);
router.get('/invoice/check-barcode',auth,invoicesController.checkBarcode);

// employees routes
router.get('/employee/add',auth,employeesController.addPage); 
router.post('/employee/add',auth,employeesController.addEmployee);
router.get('/employee/list',auth,employeesController.employeesList);


router.get('/profile',auth,authController.profilePage);
router.get('/logout',auth,authController.logout);


router.get('/employee/list',auth,userController.list);
router.get('/employee/add',auth,authController.registerPage);
router.post('/employee/add',auth,authController.registerUser);

// product routes
router.get('/product/list',auth,productController.productList);
router.get('/product/add',auth,productController.addPage);
router.post('/product/add',auth,productController.addAction);


// auth routes
router.get('/login',no_auth,authController.loginPage);
router.post('/login/action',no_auth,authController.loginAction);




router.get('/test',testController.testPage);









module.exports = router;