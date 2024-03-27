const express = require('express');
const { connectDB } = require('./config/db.js');
require('dotenv').config();
const app = express();
const adminRoute = require("./Routes/admin.js");
const mainRoute=require("./Routes/main.js")

// Connect to the database
connectDB();
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Error handler middleware
// app.use(errorHandler);



// Middleware for parsing JSON bodies
app.use(express.json());


// Admin routes
app.use('/user', adminRoute);

//costumer routes
app.use('/', mainRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
