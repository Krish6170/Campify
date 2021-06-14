const express=require("express")
const router =express.Router({mergeParams: true})
const Reviews =require("../models/review")
const wrapAsync =require("../Error/wrapAsync")
const {validator_review}=require("../valschema")
const {islogin,isReviewAuthor}=require("../isloginmiddleware")
const reviewfun=require("../controller/reviewCon")
router.get("/review",(req,res,next)=>{
  const {id}=req.params
  res.redirect(`/Allcamps/${id}`)
})
router.post("/review",islogin,validator_review,wrapAsync( reviewfun.Reviewpost))
 //delete review
 router.delete("/review/:reviewid/delete",islogin,isReviewAuthor,wrapAsync(reviewfun.deleteReview))
 module.exports=router