const jwt = require('jsonwebtoken');

const verifyTokenAndRole = (req, res, next) => {
  const token = req.headers['authorization'];
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    if (decoded.role === 'customer') {
      // Allow access for customers
      req.customer = decoded;
      next();
    } else if (decoded.role === 'user') {
      // Allow access for users (admin, etc.)
      req.user = decoded;
      next();
    } else {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = verifyTokenAndRole;
