const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  rating: Number,
  comment: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  post_on: { type: mongoose.Schema.Types.ObjectId, ref: "Campground" },
});

Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
