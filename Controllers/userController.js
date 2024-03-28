const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/Users');

exports.createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        // Save the user to the database
        await newUser.save();

        // Generate JWT token
        const tokenUser = jwt.sign({ userId: User._id, role: User.role }, process.env.JWT_SECRET, { expiresIn: '1h' });


        // Send token back to the client
        res.status(201).json({ message: 'User created successfully', tokenUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create user' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        // Find all users where IsDeleted is false
        const users = await User.find({ IsDeleted: false });
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};


  exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ username });

        // If user doesn't exist, return error
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Check if the user is soft deleted
        if (user.IsDeleted) {
            return res.status(401).json({ message: 'User has been soft deleted' });
        }

        // If password is incorrect, return error
        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate JWT token
        const tokenUser = jwt.sign({ userId: User._id, role: User.role }, process.env.JWT_SECRET, { expiresIn: '1h' });


        // Send token back to the client
        res.json({ tokenUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

  // Update a user
  exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    const { username, email, password } = req.body;

    try {
        // Find the user by ID
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user is soft deleted
        if (user.IsDeleted) {
            return res.status(404).json({ message: 'User has been deleted already' });
        }

        // Update the user fields
        user.username = username;
        user.email = email;
        user.password = await bcrypt.hash(password, 10);

        // Save the updated user
        await user.save();

        res.status(200).json({ message: 'User updated successfully', data: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update user' });
    }
};


// Delete a user
exports.deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        // Find the user by ID
        const user = await User.findById(userId);
        
        // If user not found, return a 404 Not Found response
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Set the isDeleted field to true
        user.IsDeleted = true;
        
        // Save the updated user
        await user.save();

        // Fetch all users (excluding soft deleted users)
        const users = await User.find({ isDeleted: false });

        // Respond with success message and updated user list
        res.status(200).json({ message: 'User deleted successfully', data: users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to  delete user' });
    }
};


// Search user by ID
exports.getUserById = async (req, res) => {
    const { userId } = req.params;

    try {
        // Find the user by ID
        const user = await User.findById(userId);
        
        // If user not found, return a 404 Not Found response
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Check if the user is soft deleted
        if (user.IsDeleted) {
            return res.status(404).json({ message: 'User has been already deleted' });
        }

        // If the user is not soft deleted, return the user data
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch user' });
    }
};
