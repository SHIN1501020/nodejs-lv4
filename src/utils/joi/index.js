import Joi from "joi";
import { Message } from "../../constants/index.js";


class ValidSchema {
  /**
   * joi messages초기값 사용한다면 다른 변수에서 this.joi 사용
   * nickname: this.joi.string().$.pattern(this.re_nickname).rule({ message: Message.NICKNAME_FORMAT_MISMATCH}).required()
   * 위와 같은 형식으로 $.rule로 에러 처리를 해봤으나 많은 오류들을 다 잡아낼 수가 없고 오히려 더 복잡해짐
   */
  // joi = Joi.defaults((schema)=> schema.options({
  //   messages: {
  //     'any.required' : Message.BAD_REQUEST,
  //     'any.only' : Message.PASSWORD_FORMAT_MISMATCH
  //   }
  // }));

  // 정규표현식
  re_nickname = /^[a-zA-Z0-9]{3,10}$/;
  re_password = /^[a-zA-Z0-9]{4,30}$/;

  signup = Joi.object({
    nickname: Joi.string().pattern(this.re_nickname).empty().required(),
    password: Joi.string().pattern(this.re_password).empty().required(),
    confirm: Joi.valid(Joi.ref("password")).empty().required(),
  }).custom((value, helpers)=>{
    //* 비밀번호에 닉네임이 포함된 경우 처리
    //? 바로 에러 메시지 전달해주는 방식
    return value.password.includes(value.nickname) ? helpers.message({ custom : Message.PASSWORD_INCLUDED_NICKNAM}) : value
    // error.details.context label, key에 객체가 들어가는 상태 : object에 custom 사용해서 그런 것 같다.
    //return value.password.includes(value.nickname) ? helpers.error("any.invalid", { value }, "PASSWORDINCLUDEDNICKNAM") : value
  });

  post = Joi.object({
    title: Joi.string().min(1).max(20).empty().required(),
    content: Joi.string().min(0).max(100).required(),
  });

  comment = Joi.object({
    comment: Joi.string().min(1).max(50).empty().required(),
  });
}
//? export 방식
export default new ValidSchema();
