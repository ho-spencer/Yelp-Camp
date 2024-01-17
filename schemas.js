const BaseJoi = require("joi");                  // Joi Schema
const sanitizeHTML = require("sanitize-html")    // sanitize html

// Sanitize HTML with JOI
const extension = (joi) => ({
    type: "string",
    base: joi.string(),
    messages: {
        "string.escapeHTML": "{{#label}} must not include HTML!"
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                // use npm sanitize-html to sanitize HTML from any inputs
                const clean = sanitizeHTML(value, {
                    allowedTags: [],                    // allow no tags
                    allowedAttributes: {},              // allow no attributes
                });
                if (clean !== value) {
                    return helpers.error("string.escapeHTML", { value });
                }
                return clean;
            }
        }
    }
});

// Call our extension on Joi
const Joi = BaseJoi.extend(extension);

// Campground data validation
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
});


// Review form data validation
module.exports.reviewSchema = Joi.object({
    review: Joi.object({   
        body: Joi.string().required().escapeHTML(),
        rating: Joi.number().required().min(1).max(5)
    }).required()
});
