const express= require('express')
const {connectDB}=require('./config/db.js')
require('dotenv').config()
const app= express()

// connect to DB

connectDB();

app.listen('3000',()=>{
    console.log("Server is running on port 3000")

})