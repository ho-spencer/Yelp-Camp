const mongoose = require("mongoose");
const Schema = mongoose.Schema;         // create reference to mongoose.Schema for future use

// Create Campground Schema
const CampgroundSchema = new Schema({   // normally "const CampgroundSchema = mongoose.Schema({})"
    title: String,
    price: String,
    description: String,
    location: String
})

// Compile and Export Model
module.exports = mongoose.model("Campground", CampgroundSchema);