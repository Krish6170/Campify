if(process.env.NODE_ENV!=="production"){
require("dotenv").config()
}
// console.log(process.env.Map_token)
const express = require("express");
const mongoose = require("mongoose");
const mongoSanitize = require('express-mongo-sanitize');
const path = require("path");
const ejsmate = require("ejs-mate");
const methodOverride = require("method-override");
var flash = require('connect-flash');
var session = require('express-session')
const CampRouter=require("./routes/campground_route")
const ReviewRouter=require("./routes/review_route")
const UserRouter=require("./routes/user_route")
const passport=require("passport")
const LocalStrategy=require("passport-local")
const appError = require("./Error/apperror");
const User = require("./models/user");
const helmet = require("helmet");
const MongoStore = require('connect-mongo')
const Url=process.env.db_Url||'mongodb://localhost/Campifiy'
mongoose
  .connect(Url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongo Connected");
  });
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);



const app = express();



app.engine("ejs", ejsmate);
//
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//
app.use(session({
  store: MongoStore.create({ mongoUrl: Url }),
   secret:process.env.Session_secret,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    httpOnly:true,
    // secure: true
   }
}))
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
)
app.use(mongoSanitize());
app.use(flash())
app.use(express.urlencoded({ extends: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))//user.authenticate return a function having paramters username,password like verify call back
passport.serializeUser(User.serializeUser())// view https://www.youtube.com/watch?v=fGrSmBk9v-4&list=PLYQSCk-qyTW2ewJ05f_GKHtTIzjynDgjK&index=6 from 10.3
passport.deserializeUser(User.deserializeUser())

///////
app.use((req,res,next)=>{
  res.locals.curruser=req.user
  console.log(req.query)
  res.locals.success=req.flash("success")
  res.locals.error=req.flash("error")
  next();
})
//welcome
app.get("/", (req, res) => {
  res.render("home.ejs");
});
//user
app.use("/",UserRouter)
//app get all camps
app.use("/Allcamps",CampRouter)
//review
app.use("/Allcamps/:id",ReviewRouter)


//if page not found
app.all("*", (req, res, next) => {
  throw new appError("Not Found**", 404);
});
//error
app.use((err, req, res, next) => {
  const { status = 400 } = err;
  if (!err.message) {
    err.message = "something went wrong";
  }
  
 res.status(status).render("error", { err });
  
});
const port=process.env.PORT||8000
app.listen(port, () => {
  console.log(`port ${port} connected`);
});
