const dotenv = require('dotenv')
dotenv.config();
const connectDB = require('./config/connectdb')
const express = require('express');
const app = express();
const port = process.env.PORT
const cors = require('cors')

//cors policy
app.use(cors());


app.listen(port, () =>{ 
    console.log('server listening on port 8000')
})