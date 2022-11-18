const jwt = require('jsonwebtoken');
const UserModel = require('../models/user')


var checkUserAuth = async (req, res, next)=>{
    let token 
    const { authorization } = req.headers;
    console.log(authorization)
    if (authorization && authorization.startsWith('Bearer ')){
        try{
            token = authorization.split(' ')[1]
            //console.log("Token", token)
            //console.log("Authorization", authorization)
             
            //verify token
            const {userID} = jwt.verify(token, process.env.JWT_SECRET_KEY);
            console.log(userID + "ssss");
            //get user from token
            req.user = await UserModel.find({'_id': userID})
            console.log(req.user)
            //for next middleware
            next();

        }catch(err){
            res.status(401).send({'status':'Failed', 'msg': 'Unauthorized User'});

        }
    }
    if(!token){
        res.status(401).send({'status':'Failed', 'msg': 'Unauthorized user no token found'});
    }
}

module.exports = checkUserAuth;