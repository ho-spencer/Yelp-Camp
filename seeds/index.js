const mongoose = require("mongoose");
const cities = require("./cities");                         // import cities.js
const { places, descriptors } = require("./seedHelpers");   // import seedHelpers.js
const Campground = require("../models/campground");         // require Campground model

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp")
    .then(() => {
        console.log("MONGO CONNECTION OPEN");
    })
    .catch(err => {
        console.log("MONGO CONNECTION ERROR");
        console.log(err);
    })


// Random number for "title" property - generated from seedHelpers.ejs array
const sample = array => array[Math.floor(Math.random() * array.length)];

/*
    Function to loop through cities.js and seedHelpers.js
        - FIRST: Delete all items in db    

        cities.js
            - contains 1000 cities in an array with location info
            - create random number and use that as index in cities array
            - get city, state info and set as "location" property
        
        seedHelpers.js
            - contains descriptors and places for "title" property of campground
            - set descriptor + place as "title" property
*/
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            // PERSONAL USER ID
            author: "6595ee6d05f073b9c487e7b5",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            // Seeding with default coordinates (Los Angeles) -- this is for the Map display (location is still random city, state)
            geometry: { 
                type: "Point", 
                coordinates: [ -118.242766, 34.0536916 ]
            },
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dlhoipchx/image/upload/v1704932648/YelpCamp/xevcwpzx9lmrcux8qcij.jpg',
                    filename: 'YelpCamp/xevcwpzx9lmrcux8qcij',
                },
                {
                    url: 'https://res.cloudinary.com/dlhoipchx/image/upload/v1704932649/YelpCamp/t4crja1x0x1rbn9a0akv.jpg',
                    filename: 'YelpCamp/t4crja1x0x1rbn9a0akv',
                }
            ],
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, dolorum vel facilis porro aliquam nesciunt rerum minus, commodi error natus reiciendis numquam? Architecto excepturi labore officiis iure error eos rerum?",
            price
        })
        await camp.save();
    }
}

// Run seedDB function, then close mongo connection (don't need connection to be open after seeding)
seedDB().then(() => {
    mongoose.connection.close();
});