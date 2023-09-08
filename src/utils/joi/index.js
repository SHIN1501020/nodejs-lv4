import Joi from "joi";

class validSchema {
  re_nickname = /^[a-zA-Z0-9]{3,10}$/;
  re_password = /^[a-zA-Z0-9]{4,30}$/;

  signup = Joi.object({
    nickname: Joi.string().pattern(this.re_nickname).required(),
    //? 안되는 이유 모르겠당
    password: Joi.string()
      .pattern(this.re_password)
      .forbidden(Joi.ref("nickname"))
      .required(),
    confirm: Joi.valid(Joi.ref("password")).required(),
  });

  post = Joi.object({
    title: Joi.string().min(1).max(20).required(),
    content: Joi.string().min(0).max(100).required(),
  });

  comment = Joi.object({
    comment: Joi.string().min(1).max(50).required(),
  });
}

export default new validSchema();
