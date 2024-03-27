// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error(err);
  
    // Check for specific error types and send appropriate responses
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
  
    // Handle other errors
    res.status(500).json({ message: 'Internal server error' });
  };
  
  module.exports = errorHandler;
  