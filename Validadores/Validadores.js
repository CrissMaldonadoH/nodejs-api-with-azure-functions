const Joi = require("joi");

const ValidadorUsuario = Joi.object({
  user:Joi.string().required(),
  email_domain:Joi.string().required(),
  email: Joi.string().email().required(),
  first_color: Joi.string(),
  second_color: Joi.string(),
  third_color: Joi.string(),
  fourth_color: Joi.string(),
  fifth_color: Joi.string(),
  url_logo: Joi.string()
});

const ValidadorUsuarioActualizar = ValidadorUsuario.keys({
  Id: Joi.number().integer().required(),
});

module.exports = {
  ValidadorUsuario,
  ValidadorUsuarioActualizar,
};
