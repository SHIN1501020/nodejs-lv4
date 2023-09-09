import Joi from "joi";



class validSchema {
  // 정규표현식
  re_nickname = /^[a-zA-Z0-9]{3,10}$/;
  re_password = /^[a-zA-Z0-9]{4,30}$/;

  signup = Joi.object({
    nickname: Joi.string().pattern(this.re_nickname).required(),
    password: Joi.string().pattern(this.re_password).required(),
    confirm: Joi.valid(Joi.ref("password")).required(),
  }).custom((value, helpers)=>{
    //* 비밀번호에 닉네임이 포함된 경우 처리
    //? 바로 에러 메시지 전달해주는 방식
    return value.password.includes(value.nickname) ? helpers.message({ custom : "PASSWORD_INCLUDED_NICKNAM"}) : value
    // error.details.context label, key에 객체가 들어가는 상태 : object에 custom 사용해서 그런 것 같다.
    //return value.password.includes(value.nickname) ? helpers.error("any.invalid", { value }, "PASSWORDINCLUDEDNICKNAM") : value
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
