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

// Set option to include virtuals in result object when converting document (the campground data) to JSON
const opts = { toJSON: { virtuals: true }}

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
}, opts);

// Virtual property that returns a link to the campground show page -- this refers to the specific campground instance
// Includes description with first 20 characters
CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
    return `
        <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
        <p>${this.description.substring(0,20)}</p>
        `
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