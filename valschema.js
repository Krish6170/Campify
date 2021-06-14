const BaseJoi = require("joi");
const appError=require("./Error/apperror")
const sanitizeHtml = require('sanitize-html');
const extension = (joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
      'string.escapeHTML': '{{#label}} must not include HTML!'
  },
  rules: {
      escapeHTML: {
          validate(value, helpers) {
              const clean = sanitizeHtml(value, {
                  allowedTags: [],
                  allowedAttributes: {},
              });
              if (clean !== value) return helpers.error('string.escapeHTML', { value })
              return clean;
          }
      }
  }
});

const Joi = BaseJoi.extend(extension)
module.exports.validator = (req, res, next) => {
  const schema = Joi.object({
    Campgrounds: Joi.object({
      title: Joi.string().min(3).max(30).required().escapeHTML(),
      location: Joi.string().min(3).max(30).required().escapeHTML(),
      price: Joi.number().positive().required(),
      description: Joi.string().required().escapeHTML(),
      // image: Joi.string().uri().required(),
    }).required(),
    deleteImages:Joi.array()
  });
  
  const {error}=schema.validate(req.body)
  if(error){
    const msg=error.details.map(el=>el.message).join(",")
      throw new appError(msg,400)}
  else{
      next()
  }

};
module.exports.validator_review=(req,res,next)=>{
  const schema=Joi.object({
    Review:Joi.object({
      rating:Joi.number().integer().min(0).max(5).required(),
      comment:Joi.string().required().escapeHTML(),
    }).required(),



  })
  const {error}=schema.validate(req.body)
  if(error){
    const msg=error.details.map(el=>el.message).join(",")
      throw new appError(msg,400)}
  else{
      next()
  }




}


