const Campground = require("./models/campmod");
const Review =require("./models/review")
module.exports.islogin = (req, res, next) => {
    
  if (!req.isAuthenticated()) {
    req.session.returnTo=req.originalUrl
   
    req.flash("error", "login");
    res.redirect("/login");
  } else {
    next();
  }
};

module.exports.isPostAuthor=async(req, res, next) => {
  const {id}=req.params
  
  const camp= await Campground.findById(id) 
   

  if (camp.author.equals(req.user._id)) {
    
 
    next()
  } else {
    req.flash("error", "You are not author");
    res.redirect(`/Allcamps/${id}`)
  }
};
module.exports.isReviewAuthor=async(req, res, next) => {
  const {id,reviewid}=req.params
  const review= await Review.findById(reviewid)  

  if (review.author.equals(req.user._id)) {
 
    next()
  } else {
    req.flash("error", "You are not author");
    res.redirect(`/Allcamps/${id}`)
  }
};



