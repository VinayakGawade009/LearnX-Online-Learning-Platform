const Joi = require("joi");
const tags = require("./tags");

const tagValues = tags.map(tag => tag.value);

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        tags: Joi.array().items(Joi.string().valid(...tagValues)).required(),
        language: Joi.string().valid("English", "Hindi").required(),
        state: Joi.string().valid("Recorded", "Live").required(),
        image: Joi.string().allow("", null),
        videoUrl: Joi.string().required() // Use .uri() if you want to strictly validate it as a URL
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number()
            .required()
            .min(1)
            .max(5),
        comment: Joi.string()
            .required(),
    }).required(),
})