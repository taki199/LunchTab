const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace
  
    // Check if the error is a known HTTP error
    if (err.status) {
      res.status(err.status).json({ message: err.message });
    } else {
      // If the error is unknown, return a 500 Internal Server Error
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  module.exports = errorHandler;
  