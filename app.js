const dotenv = require('dotenv')
dotenv.config();
const connectDB = require('./config/connectdb')
const express = require('express');
const app = express();
const port = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL

const userRouter = require('./routes/userRouter')
//import userRouter from './routes/userRouter'
const cors = require('cors')
//import connectdb from './config/connectdb'


//cors policy -cors error get when we connect frontend server
app.use(cors());

//Database connection
connectDB(DATABASE_URL)

// for using middleware in application
app.use(express.json());

//load routes
app.use('/api/user', userRouter)




app.listen(port, () =>{ 
    console.log('server listening on port 8000')
})