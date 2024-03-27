const dish = require('../Controllers/dishesController')
const order=require('../Controllers/orderController')
const category=require("../Controllers/categoriesController")
const user=require("../Controllers/userController")
const express = require('express');
const router = express.Router();

const verifyTokenAndRole = require('../middleware/verifyToken');

// Protected route that requires authentication
// Apply verifyToken middleware to routes that need authentication
// router.use(verifyToken);



//Dishes Route


router.get("/dishes",verifyTokenAndRole, dish.getAllDishes);
router.get("/dishes/:id", dish.findById);
router.post("/dishes", dish.createDish);
router.put("/dishes/:id", dish.updateDish);
router.delete("/dishes/:id", dish.deleteDish);

//Orders Route

router.get("/orders",order.getAllOrders);
router.get("/orders/:id",order.findOrderById)
router.post("/orders",order.createOrder);
router.put("/orders/:id",order.updateOrder);
router.delete("/orders/:id",order.deleteOrder);

//category
router.post('/categories',category.createCategory);
router.get('/categories', category.getCategories);
router.put('/categories/:id', category.updateCategory);
router.delete('/categories/:id', category.deleteCategory);

//user
router.post('/login', user.login);
router.post('/register', user.createUser);
router.get('/users', user.getAllUsers);




// router.put('/users/:id', userController.updateUser);
// router.delete('/users/:id', userController.deleteUser);




module.exports = router;