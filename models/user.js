const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');
userschema = new mongoose.Schema({
  email: { type: String, required: true },
});
userschema.plugin(passportLocalMongoose)
module.exports = mongoose.model('User', userschema)

