const Reviews = require("./review");
const mongoose = require("mongoose");
const { cloudinary } = require("../cloudinary/cloud");
// https://res.cloudinary.com/dpinp5laq/image/upload/w_300/v1623149820/Camp/mndtnwxuc5kf7rvcz92l.jpg
//for passing json virtuals under maps
var schemaOptions = {
  toJSON: {
    virtuals: true,
  },
};

const ImageSchema = new mongoose.Schema({
  url: String,
  filename: String,
});
ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("upload/", "upload/w_100/");
});
const Schema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    location: {
      type: String,
    },
    geometry: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"], // 'location.type' must be 'Point'
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    image: [ImageSchema],
    description: {
      type: String,
    },
    price: {
      type: Number,
      min: 0,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  schemaOptions
);
Schema.virtual("properties.pop").get(function () {
  return `<a href=/Allcamps/${this._id}>${this.title}</a>`;
});
Schema.post("findOneAndDelete", async (camp) => {
  for (let imaged of camp.image) {
    let filename = imaged.filename;

    await cloudinary.uploader.destroy(filename);
  }
 
  if (camp) {
    await Reviews.deleteMany({ post_on: camp._id });
  }
});
// Schema.post("findOneAndDelete", async (camp) => {
//   if (camp) {
//     await Reviews.deleteMany({ post_on: camp._id });
//   }
// });

const Campground = mongoose.model("Campground", Schema);
module.exports = Campground;
