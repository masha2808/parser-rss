const joi = require('joi');

const postSchema = joi.object({
  title: joi.string().required(),
  link: joi.string().required(),
  description: joi.string().required(),
  pubDate: joi.date().required(),
  dcCreator: joi.string().required(),
  guid: joi.string().required(),
  categories: joi.array().items(joi.object({
    categoryName: joi.string().required()
  })).required()
});

module.exports = {
  postSchema
};
