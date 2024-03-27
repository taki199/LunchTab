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
        const tokenUser = jwt.sign({ userId: User._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send token back to the client
        res.status(201).json({ message: 'User created successfully', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create user' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find();
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
  
      // If user doesn't exist or password is incorrect, return error
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      // Generate JWT token
      const tokenUser = jwt.sign({ userId: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      // Send token back to the client
      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };