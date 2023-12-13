const mongoose = require("mongoose");
const Review = require("./review.js");      // require Review model
const Schema = mongoose.Schema;             // create reference to mongoose.Schema for future use

// Create Campground Schema
const CampgroundSchema = new Schema({   // normally "const CampgroundSchema = mongoose.Schema({})"
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review" 
        }
    ]
});

// DELETE ALL ASSOCIATED REVIEWS WHEN A CAMPGROUND IS DELETED
CampgroundSchema.post("findOneAndDelete", async function (campground) {
    if (campground) {
        await Review.deleteMany({
            _id: {
                $in: campground.reviews
            }
        })
    }
})

// Compile and Export Model
module.exports = mongoose.model("Campground", CampgroundSchema);