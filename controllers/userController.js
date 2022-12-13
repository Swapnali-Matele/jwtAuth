const UserModel = require('../models/user')
//import UserModel from "../models/user";
const bcrypt = require('bcrypt')
//import bcrypt from "bcrypt";
const jwt = require('jsonwebtoken');
//import jwt from "jsonwebtoken";

//here we create class andthen written static functions inside the class

const userRegistartion = async (req, res) => {
    // ithe aapn ekhada registration form madhe kontya field fill krayhya tya mention kelya
    const { name, email, password, password_confirmation, tc } = req.body;

    // ithe email jar db madhe adhich present aseltr tya email id ne part reg. hovu shakt nhi te show krayche
    const user = await UserModel.findOne({ email: email });

    if (user) {
      res.send({ status: "Failed", message: "Email already exists" });
    } else {
      if (name && email && password && password_confirmation && tc) {
        if (password === password_confirmation) {
          try {
            //passwaord decryptmeans hide krnyasathi function below
            //const salt = await bcrypt.genSalt(10);
            bcrypt.hash('mypassword', 10, function(err, hash) {
                if (err) { throw (err); }
            
                bcrypt.compare('mypassword', hash, function(err, result) {
                    if (err) { throw (err); }
                    console.log(result);
                });
            });
           // const hashPassword = await bcrypt.hash(password, salt);

            // here we save all data into specific feild
            const doc = new UserModel({
              name: name,
              email: email,
              password: password,
              //password_confirmation: password_confirmation,
              tc: tc,
            });
            // to save the data into doc var which user give in input form
            await doc.save();
            const saved_user = await UserModel.findOne({email:email})

            //generate JWT Token
            const token = jwt.sign({ userID: saved_user._id},process.env.JWT_SECRET_KEY,{expiresIn:'5d'});
            res.status(201).send({"status": "Success", "msg":"Registration successful","token": token});
          } catch (err) {
            console.log(err)
            res.send({ status: "Failed", message: err});
          }
        } else {
          res.send("password and password confirmation doent match");
        }
      } else {
        res.send({ status: "Failed", message: "All feilds are required" });
      }
    }
  }

 const userLogin = async (req, res)=>{
    try{
        const{email, password} = req.body
        if(email && password){
            const user = await UserModel.findOne({email: email})
            //console.log(user)
            if (user != null){
                console.log(user.email)
                //const isMatch = await bcrypt.compare(password, user.password)
                //console.log(isMatch)
                if((user.email === email) && password){
                    console.log(user.email)

                    //generate JWT Token
                    const token = jwt.sign({ userID: user._id},process.env.JWT_SECRET_KEY,{expiresIn:'5d'})
                    res.send({'msg':'login successful','token':token})
                }else{
                    res.send('email or password does not match')
                }
            }else{
                res.send({"status":"failed", "msg":"Email  dosent match with DB"})
            }
        } else{
            res.send({'status':'failed', 'message': 'All feilds are required'})
        }
    }catch(err){
        console.log(err)
    }

   }

 const changeUserPassword = async (req, res)=>{
    const password = req.body.password
    const password_confirmation = req.body.password_confirmation
    console.log(req.user)
    console.log(password, password_confirmation)
    if(password && password_confirmation){
        if(password !== password_confirmation){
            res.send({'status': 'failed', 'message':'new password and confirm new password doesnt match'})
        }else{
        //   bcrypt.hash('mypassword', 10, function(err, hash) {
        //     if (err) { throw (err); }
        
        //     bcrypt.compare('mypassword', hash, function(err, result) {
        //         if (err) { throw (err); }
        //         console.log(result);
        //     });
        // });
        
        
        //To save new change password into mongo DB
        //const user = await UserModel.findOne({ _id: _id });
         var userPassReset = await UserModel.findOne({_id:req.user[0]._id})
         console.log(req.user[0]._id)
         try{
         console.log(userPassReset)
         //userPassReset.password = password
         userPassReset.password_confirmation = password
         console.log(userPassReset.password_confirmation)
         console.log(userPassReset)
         await UserModel.findByIdAndUpdate(req.user[0]._id, userPassReset, { new: true, runValidators:true})
        res.send({'status': 'success', 'msg':'Password change successfully'}) 
         }catch (err){
          console.log(err)
         }
            
      }
    }else{
        res.send({'status': 'failed', 'message':'All feilds are required'})
    }
  }

  const loggedUser = async (req, res)=>{
      res.send({"user":req.user})
    
  }
  const sendUserPasswordResetEmail = async (req, res)=>{
    const {email} = req.body
    if(email){
     const user = await UserModel.findOne({ email: email })

     //password reset cha mail user chya mail box madhe send krnyasathi code 
     const secret = user._id + process.env.JWT_SECRET_KEY
     if(user){
      //create token 
      const token = jwt.sign({userID: user._id}, secret,{expiresIn: '16m'})
      //console.log
      //create link for reset password
      const link =`https://loalhost:3000/api/users/reset/${user._id}/${token}` 
      console.log(link)

      res.send ({'status': 'success', 'msg':'Password reset link sent on your email'})

     }else{
      res.send({'status': 'failed', 'msg':'email does not exist'})

     }
    }else{
      res.send({"status": "Failed", "message": "email feild is required"})
    }
}
const userPasswordReset = async (req, res)=>{
      const {password,password_confirmation} = req.body
      const {id, token}= req.params
      //id nikalo first
      const user = await UserModel.findById(id)
      const new_secret = user._id + process.env.JWT_SECRET_KEY

      //verify token here
      try{
        jwt.verify(token, new_secret)
        if(password && password_confirmation){
          if(password === password_confirmation){
            res.send ('reset password successfully')
          }else{
            res.send('reset password failed')
         
          }
        }else{

          res.send('All feilds are required')
      
      }

      }catch(err){
        console.log(err)
        res.send({'status': 'failed', 'message':'Invalid token'})
      }
  

}


   //export default UserController
    module.exports = {
    userRegistartion,
    userLogin,
    changeUserPassword,
    loggedUser,
    sendUserPasswordResetEmail,
    userPasswordReset,
}