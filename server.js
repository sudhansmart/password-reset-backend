const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const app = express();

const dotenv = require('dotenv');
dotenv.config()


app.use(cors());
app.use(express.json());


// Connecting to MongoDB
mongoose
.connect(process.env.DB_URL,{})
.then(()=>{
    console.log("MongoDb is Connected")
})
.catch((err)=>{
        console.log("MongoDb Not Connected",err.message)
})

app.use('/signin',require('./routes/signin'));
app.use('/login',require('./routes/login'))
app.use('/forgot',require('./routes/forgotpassword'))





app.listen(process.env.PORT,()=>{
    console.log("Server is running on PORT",process.env.PORT);
})