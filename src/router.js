const express = require('express');
const router = express.Router();

const homeController = require('./controllers/home_controller');
const userController = require('./controllers/user_controller');
const authController = require('./controllers/auth_controller');
const testController = require('./controllers/test_controller');
const productController = require('./modules/products/controllers/product_controller');
const salesController = require('./modules/sales/controllers/sales_controller');
const {auth,no_auth} = require('./middlewares/auth');



router.get('/',auth,homeController.getHome);
router.get('/table',auth,homeController.getTable);
router.get('/tabs',auth,homeController.getTabs);


// sales routes
router.get('/sale/add',auth,salesController.addPage); 
router.post('/sale/add',auth,salesController.addSale);
router.get('/sale/list',auth,salesController.salesList);



// auth routes
router.get('/login',no_auth,authController.loginPage);
router.post('/login/action',no_auth,authController.loginAction);


router.get('/profile',auth,authController.profilePage);
router.get('/logout',auth,authController.logout);


router.get('/employee/list',auth,userController.list);
router.get('/employee/add',auth,authController.registerPage);
router.post('/employee/add',auth,authController.registerUser);

// product routes
router.get('/product/list',auth,productController.productList);
router.get('/product/add',auth,productController.addPage);
router.post('/product/add',auth,productController.addAction);




// router.get('/test,testController.testPage);









module.exports = router;