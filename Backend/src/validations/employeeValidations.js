const Joi = require('joi');

const employeeValidationSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .trim()
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 100 characters',
      'string.empty': 'Name is required'
    }),

  email: Joi.string()
    .email()
    .required()
    .trim()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required'
    }),
    managerName: Joi.string()
    .allow(null, '')
    .trim()
    .messages({
      'string.empty': 'Manager name can be empty'
    }),

    dateOfJoining: Joi.date()
  .required()
  .messages({
    'date.base': 'Date of Joining must be a valid date',
    'any.required': 'Date of Joining is required'
  })
});


module.exports = {employeeValidationSchema};