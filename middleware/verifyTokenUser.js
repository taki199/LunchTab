const jwt = require('jsonwebtoken');

const verifyTokenAndUser = (req, res, next) => {
  const header = req.headers['authorization'];
  
  if (!header) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = header.split(' ')[1]; // Bearer <token>
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    
    // Check the role field from the decoded token
    if (decoded.role === 'user') {
      // Allow access for users
      req.user = decoded;
      req.userId = decoded.userId;
      next();
    } else {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = verifyTokenAndUser;
