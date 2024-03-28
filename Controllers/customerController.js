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
        const tokenCustomer = jwt.sign({ userId: Customer._id, role: 'customer' }, process.env.JWT_SECRET, { expiresIn: '1h' });




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
        // Find the customer by username where IsDeleted is false
        const customer = await Customer.findOne({ username, IsDeleted: false });
        if (!customer) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, customer.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const tokenCustomer = jwt.sign({ userId: Customer._id, role: 'customer' }, process.env.JWT_SECRET, { expiresIn: '1h' });



        res.json({ token: tokenCustomer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



exports.getAllCustomers = async (req, res) => {
    try {
        // Find all customers where IsDeleted is false
        const customers = await Customer.find({ IsDeleted: false });
        res.status(200).json(customers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch customers' });
    } 
};


// Update a customer
exports.updateCustomer = async (req, res) => {
    const id = req.params.id;
    console.log(id)

    const { username, email, password } = req.body;

    try {
        // Find the customer by ID
        let customer = await Customer.findById(id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Update the customer fields
        customer.username = username;
        customer.email = email;
        customer.password = await bcrypt.hash(password, 10);

        // Save the updated customer
        await customer.save();

        res.status(200).json({ message: 'Customer updated successfully', data: customer});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update customer' });
    }
};

// Delete a customer
exports.deleteCustomer = async (req, res) => {
    const id = req.params.id;

    try {
        // Find the customer by ID where IsDeleted is false
        const customer = await Customer.findOne({ _id: id, IsDeleted: false });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Soft delete the customer by updating the IsDeleted field
        customer.IsDeleted = true;
        await customer.save();

        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete customer' });
    }
};

// Search customer by ID
exports.getCustomerById = async (req, res) => {
    const id = req.params.id;
    console.log(id);

    try {
        // Find the customer by ID where IsDeleted is false
        const customer = await Customer.findOne({ _id: id, IsDeleted: false });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json(customer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch customer' });
    }
};

