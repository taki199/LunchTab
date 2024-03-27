const verifyTokenAndRole = require('../middleware/verifyToken');
const customerController = require('../Controllers/customerController');
const express = require('express');
const router = express.Router();


// Login route

router.post('/Register', customerController.createCustomer);
router.post('/login', customerController.loginCustomer);

// Protected route that requires authentication
router.get('/customers', verifyTokenAndRole,customerController.getAllCustomers);
module.exports = router;