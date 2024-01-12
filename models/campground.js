const mongoose = require("mongoose");
const Review = require("./review.js");      // require Review model
const Schema = mongoose.Schema;             // create reference to mongoose.Schema for future use


// Image Schema (for virtual properties)
const ImageSchema = new Schema({
    url: String,
    filename: String
});

// Virtual Property for Each Image
ImageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200");        // "this" refers to each image
});

// Create Campground Schema
const CampgroundSchema = new Schema({   // normally "const CampgroundSchema = mongoose.Schema({})"
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }, 
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
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