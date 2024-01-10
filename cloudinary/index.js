const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

// Instantiate Instance of CloudinaryStorage
const storage = new CloudinaryStorage({
    cloudinary,
    folder: "YelpCamp",
    allowedFormats: ["jpeg", "png", "jpg"]
});

// Export the Configured Cloudinary Instance and Storage
module.exports = {
    cloudinary,
    storage
}