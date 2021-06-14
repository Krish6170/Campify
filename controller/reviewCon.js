const Campgrounds = require("../models/campmod");
const Reviews =require("../models/review")
module.exports.Reviewpost=async(req,res,next)=>{
    const {id}=req.params
    rev=new Reviews(req.body.Review)
    rev.author=req.user._id
    rev.post_on=id
    rev.save()
    req.flash("success","SUCCESSFULLY ADDED REVIEW ")
    res.redirect(`/Allcamps/${id}`)
    
 }
 module.exports.deleteReview=async(req,res,next)=>{
    const {id,reviewid}=req.params
    await Reviews.findByIdAndDelete(reviewid)
    req.flash("success","SUCCESSFULLY DELETED REVIEW")
    res.redirect(`/Allcamps/${id}`)
  
  }