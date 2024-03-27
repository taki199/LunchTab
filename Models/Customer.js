const mongoose = require('mongoose');
const customerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true // Ensure uniqueness of usernames
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure uniqueness of emails
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ // Regular expression for email validation
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

  
  const Customer = mongoose.model('Customer', customerSchema);
  
  module.exports = {
   
    Customer
  };