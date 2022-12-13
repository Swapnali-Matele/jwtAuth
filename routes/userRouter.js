const express = require('express')
//import express from 'express';
const router = express.Router();
const { 
    userRegistartion, 
    userLogin, 
    changeUserPassword, 
    loggedUser,
    sendUserPasswordResetEmail,
    userPasswordReset } = require('../controllers/userController')
//import UserController from '../controllers/userController';
const checkUserAuth = require('../middlewares/auth-middleware')


//public routes 
router.post('/register', userRegistartion)
router.post('/login', userLogin)
router.post('/resetpass',sendUserPasswordResetEmail)
router.post('/reset-pass/:id/:token',userPasswordReset)

//route level middleware - to protect level routes
router.use('/changepassword', checkUserAuth)

// protected route - login ke baad acess kr sakte hai   
router.post('/changepassword', changeUserPassword)
router.patch('/changepassword', changeUserPassword)
router.post('/loggeduser', loggedUser)

module.exports = router ;