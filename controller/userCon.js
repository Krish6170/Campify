const User=require("../models/user")
module.exports.registerPost=async(req,res,next)=>{
    try{
    const{email,username,password}= req.body
     const user=new User({email,username})
     await User.register(user,password)
     req.logIn(user,err=>{
         if(err) return next(err)
         req.flash("success","welcome")
         res.redirect("/Allcamps")
     })
    }
     catch(e){
         req.flash("error",e.message)
         res.redirect("/register")

     }
     
    
}


module.exports.loginPost=(req,res,next)=>
{   const returnUrl=req.session.returnTo || "/Allcamps"
    req.flash("success",`welcome ${req.user.username}`)
    delete req.session.returnTo
    res.redirect(returnUrl)
}
module.exports.logout=(req,res)=>{
    req.logOut()
    req.flash("success","Successfully logged out!!!")
    res.redirect("/login")
}