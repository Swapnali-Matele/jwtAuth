const mongoose = require('mongoose');
 
const connectDB = async (DATABASE_URL)=>{
    try{
        const DB_OPTION = {
            dbName: 'JWTAuthantication'
        }
        await mongoose.connect(DATABASE_URL, DB_OPTION)
        console.log('Connected to database');
    }catch(err){
        
        console.log(err)

    }
}

module.exports = connectDB;