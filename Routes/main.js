const verifyTokenAndRole = require('../middleware/verifyToken');
const customerController = require('../Controllers/customerController');
const category=require("../Controllers/categoriesController")
const dish = require('../Controllers/dishesController')
const order=require('../Controllers/orderController')

const express = require('express');
const router = express.Router();


//customer can access to his order  history (get) 
router.get('/orders',verifyTokenAndRole,order.getOrdersByUser)
//customer can create order  for a specific dish(post)
router.post("/orders",verifyTokenAndRole,order.createOrder);

router.post('/Register',customerController.createCustomer);
router.post('/Login',customerController.loginCustomer);


//delete order by id (delete)
router.delete('/orders/:id',verifyTokenAndRole,order.deleteOrder)

// customer can access to profile (customer)
router.get('/customers/:id',verifyTokenAndRole,customerController.getCustomerById)

// customer can delete his own acc  (delete)
router.delete('/customers/:id',verifyTokenAndRole,customerController.deleteCustomer)
// customer can brows all dishes    (get)
router.get("/dishes", dish.getAllDishes);
// customer can brows all categories (get)
router.get('/categories', category.getCategories);
//customer can update his infos (put)
router.put('/customers/:id',verifyTokenAndRole,customerController.updateCustomer)

//get 
//router.get('/customers', verifyTokenAndRole,customerController.getAllCustomers); in admin only can see all 









router.post('/Register', customerController.createCustomer);
router.post('/login', customerController.loginCustomer);
router.post("/orders",order.createOrder);





// Protected route that requires authentication

module.exports = router;