const dish = require('../Controllers/dishesController')
const order=require('../Controllers/orderController')
const category=require("../Controllers/categoriesController")
const customerController = require('../Controllers/customerController');
const user=require("../Controllers/userController")
const express = require('express');
const router = express.Router();

const verifyTokenAndRole = require('../middleware/verifyToken');

// Protected route that requires authentication
// Apply verifyToken middleware to routes that need authentication
// router.use(verifyToken);



//Dishes Route


router.get("/dishes", dish.getAllDishes);
router.get("/dishes/:id", dish.findById);
router.post("/dishes",verifyTokenAndRole, dish.createDish);
router.put("/dishes/:id",verifyTokenAndRole, dish.updateDish);
router.delete("/dishes/:id",verifyTokenAndRole, dish.deleteDish);

//Orders Route

router.get("/orders",verifyTokenAndRole,order.getAllOrders);
router.get("/orders/:id",verifyTokenAndRole,order.findOrderById)
router.post("/orders",verifyTokenAndRole,order.createOrder);
router.put("/orders/:id",verifyTokenAndRole,order.updateOrder);
router.delete("/orders/:id",verifyTokenAndRole,order.deleteOrder);

//category
router.post('/categories',verifyTokenAndRole,category.createCategory);
router.get('/categories', category.getCategories);
router.get('/categories/:id', category.getCategoryById);
router.put('/categories/:id',verifyTokenAndRole, category.updateCategory);
router.delete('/categories/:id', verifyTokenAndRole,category.deleteCategory);

//user
router.post('/loginUser', user.login);
router.post('/registerUser', user.createUser);
router.get('/users',verifyTokenAndRole, user.getAllUsers);
router.put('/users/:id',verifyTokenAndRole,user.updateUser)
router.delete('/users/:id',verifyTokenAndRole,user.deleteUser)

//customers
router.get('/customers/:id', verifyTokenAndRole, customerController.getCustomerById);
router.get('/customers', verifyTokenAndRole,customerController.getAllCustomers)
//router.put('/customers/:id',verifyTokenAndRole,customerController.updateCustomer)
router.delete('/customers/:id',verifyTokenAndRole,customerController.deleteCustomer)
router.post('/Register', customerController.createCustomer);
router.post('/login', customerController.loginCustomer);


// 

// router.put('/users/:id', userController.updateUser);
// router.delete('/users/:id', userController.deleteUser);




module.exports = router;