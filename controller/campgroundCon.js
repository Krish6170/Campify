const Campgrounds = require("../models/campmod");
const Reviews = require("../models/review");
const {cloudinary}=require("../cloudinary/cloud")
const mbxGeo = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient= mbxGeo({ accessToken:"pk.eyJ1Ijoia3Jpc2g2MTcwIiwiYSI6ImNrcHBwa3hwNDA0aWwyb3J2Y25wdXQxaW4ifQ.0tbP33XW8dBv45ThtHgszQ" })
module.exports.index = async (req, res, next) => {
  const camps = await Campgrounds.find({});
  // console.log(camps)

  res.render("allCamps", { camps });
};

module.exports.newCamp = (req, res) => {
  console.log(req.user);

  res.render("new");
};

module.exports.newCamppost = async (req, res, next) => {
  
  const geodata=await geocodingClient.forwardGeocode({
    query: req.body.Campgrounds.location,
    limit: 1
  })
    .send()
  
  const camp = new Campgrounds(req.body.Campgrounds);
  camp.author = req.user._id;
  camp.image = req.files.map((el) => ({ url: el.path, filename: el.filename }));
   camp.geometry=geodata.body.features[0].geometry 
  console.log(camp.geometry)
  
  await camp.save();
  req.flash("success", "SUCCESSFULLY ADDED CAMP GROUND");
  res.redirect("/Allcamps");
};

module.exports.detail = async (req, res, next) => {
  const { id } = req.params;
  const detail = await Campgrounds.findById(id).populate("author");
  if (!detail) {
    req.flash("error", "No campground Found");
    return res.redirect("/Allcamps");
  }
  const reviews = await Reviews.find({ post_on: id }).populate("author");

  if (!detail) {
    req.flash("error", "NO Camp Ground");
    return res.redirect("/Allcamps");
  }
  // console.log(detail)
  res.render("show", { detail, reviews });
};
module.exports.updateform = async (req, res, next) => {
  const { id } = req.params;
  const detail = await Campgrounds.findById(id);

  // if (!detail) {
  //   throw new appError("Campground not found to edit", 404);
  // }
  if (!detail) {
    req.flash("error", "No campground Found");
    return res.redirect("/Allcamps");
  }

  // console.log(detail.description)
  res.render("edit.ejs", { detail });
};

module.exports.updateput = async (req, res, next) => {
  const { id } = req.params;

  //  console.log(id)

  const camp = await Campgrounds.findByIdAndUpdate(id, req.body.Campgrounds);
  const temp = req.files.map((el) => ({ url: el.path, filename: el.filename }));
  camp.image.push(...temp);
  await camp.save();
  if (req.body.deleteImages) {
    await camp.updateOne({
      $pull: { image: { filename: { $in: req.body.deleteImages } } },
    });
    for (let filename of req.body.deleteImages){
      await cloudinary.uploader.destroy(filename)
    }
    
  }
  req.flash("success", "SUCCESSFULLY UPDATED GROUND");
  // console.log(Campground.findById(id))
  res.redirect(`/Allcamps/${id}`);
};
module.exports.deletecamp = async (req, res, next) => {
  const { id } = req.params;

  await Campgrounds.findByIdAndDelete(id);
  
  res.redirect("/Allcamps");
};
