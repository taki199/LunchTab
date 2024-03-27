const {Customer} = require('../Models/Customer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createCustomer = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if a customer with the same email already exists
        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({ message: 'Email address is already in use' });
        }
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the customer
        const newCustomer = new Customer({
            username,
            email,
            password: hashedPassword
        });

        // Save the customer to the database
        await newCustomer.save();

        // Generate JWT token
        // Generate JWT token
     const tokenCustomer = jwt.sign({ customerId: newCustomer._id, role: 'customer' }, process.env.JWT_SECRET, { expiresIn: '1h' });


        // Send token back to the client
        res.status(201).json({ message: 'Customer created successfully', token: tokenCustomer });
    } catch (error) {
        // Check for duplicate key error (E11000)
        if (error.code === 11000 && error.keyPattern.email === 1) {
            return res.status(400).json({ message: 'Email address is already in use' });
        }

        console.error(error);
        res.status(500).json({ message: 'Failed to create customer' });
    }
};



exports.loginCustomer = async (req, res) => {
    const { username, password } = req.body;

    try {
        const customer = await Customer.findOne({ username });
        if (!customer) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, customer.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const tokenCustomer = jwt.sign({ userId: customer._id, role: 'customer' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token: tokenCustomer }); // Corrected variable name
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch customers' });
    }
};
