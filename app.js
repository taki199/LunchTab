const express= require('express')
require('dotenv').config()
const app= express()
const {connectDB}=require('./server/config/db')
const coookieParser=require('cookie-parser')
const MongoStore = require('connect-mongo')
const session = require('express-session');

app.listen('3000',()=>{
    console.log("Server is running on port 3001")

})