const express=require("express")
const router =express.Router()
const wrapAsync= require("../Error/wrapAsync")
const User=require("../models/user")
const passport=require("passport")
const { session } = require("passport")
const userfun=require("../controller/userCon")

router.get("/register",(req,res,next)=>{
    res.render("userRegister")
})
router.post("/register",wrapAsync(userfun.registerPost))
router.get("/login",(req,res,next)=>{

    res.render("userLogin")
})
router.post("/login",passport.authenticate('local', {failureRedirect: '/login',failureFlash:"Try again!!!" }),userfun.loginPost)
router.get("/logout",userfun.logout)
module.exports=router