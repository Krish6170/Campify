const express =require("express")
const router=express.Router()
const wrapAsync=require("../Error/wrapAsync")
// const appError =require("../Error/apperror")
// const Campgrounds = require("../models/campmod");
const {validator} = require("../valschema");
// const Reviews =require("../models/review")
const {islogin,isPostAuthor}=require("../isloginmiddleware")
const {storage}=require("../cloudinary/cloud")
var multer  = require('multer')
var upload = multer({ storage })
const campfun=require("../controller/campgroundCon")
  router.get(
    "/",
    wrapAsync(campfun.index)
  );
  // app new
  router.get("/new", islogin,campfun.newCamp);
  router.post(
    "/",islogin,upload.array('image'),
    validator,
    wrapAsync(campfun.newCamppost)
  );
 

  
  //app detail
  router.get(
    "/:id",
    wrapAsync(campfun.detail)
  );
  //app update
  router.get(
    "/:id/edit",islogin,isPostAuthor,
    wrapAsync(campfun.updateform)
  );
  router.put(
    "/:id/edit",islogin,isPostAuthor,upload.array('image'),
    validator,
    wrapAsync(campfun.updateput)
  );

  router.delete(
    "/:id/delete",islogin,isPostAuthor,
    wrapAsync(campfun.deletecamp)
  );

module.exports=router