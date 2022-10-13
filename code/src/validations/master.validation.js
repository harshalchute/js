const Joi = require('joi');
const { password } = require('./custom.validation');

const masterAccount = {
  body: Joi.object().keys({
    accountType: Joi.string().required(),
  }),
};

const transactionalAccount = {
  body : Joi.object().keys({
    accountType: Joi.string().required(),
  })
}

module.exports = {
  masterAccount,
};
