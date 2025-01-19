import Joi from "joi";
class User {
  constructor(id, email, firstName, lastName, password, balance=0, isAdmin = false) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.balance = balance;
    this.isAdmin = isAdmin;
  }

  validate = () => {
    const schema = Joi.object({
      id: Joi.string().uuid().required(),
      email: Joi.string().email().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      balance: Joi.number().required().min(0),
      isAdmin: Joi.boolean().required(),
    });

    return schema.validate({
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      balance: this.balance,
      isAdmin: this.isAdmin,
    });
  };

  validateSignup = () => {
    const schema = Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      //challenge 1.b begins here
      //challenge 1.b ends here
    });

    return schema.validate({
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
    });
  };

  validateLogin = () => {
    const schema = Joi.object({
      email: Joi.required(),
      password: Joi.required(),
    });

    return schema.validate({
      email: this.email,
      password: this.password,
    });
  };

  validateId = () => {
    const schema = Joi.object({
      id: Joi.string().uuid().required(),
    });

    const validate = schema.validate({ id: this.id });

    if (validate.error) return validate.error.details[0].message;
  };
}

export default User;
