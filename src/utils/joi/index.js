import Joi from "joi";
import { Message } from "../../constants/index.js";

/**
 * Joi(유효성 검사 라이브러리) 스키마 구성 클래스
 * 
 * 회원 가입, 게시글, 댓글 관련해 유효성 검사를 위한 joi 스키마를 구성하는 클래스입니다.
 * 
 * @class
 * @see {@link https://joi.dev/api/?v=17.9.1}
 * @namespace ValidSchema
 */
class ValidSchema {  
  // 정규표현식
  re_nickname = /^[a-zA-Z0-9]{3,10}$/;
  re_password = /^[a-zA-Z0-9]{4,30}$/;
  /**
   * @typedef {object} SchemaSignup
   * @property {string} nickname - 닉네임
   * @property {string} password - 비밀번호
   * @property {string} confirm - 비밀번호 확인
   */

  /**
   * 회원 가입 유효성 검사 스키마
   * 
   * 닉네임은 a-z, 0-9 값들로 3-10 글자만 가능합니다.
   * 비밀번호는 a-z, 0-9 값들로 4-30 글자만 가능하며, 닉네임 값을 포함할 수 없습니다.
   * 비밀번호 확인은 비밀번호와 동일해야합니다.
   * @member {Joi.ObjectSchema<SchemaSignup>} signup
   */
  signup = Joi.object({
    nickname: Joi.string().pattern(this.re_nickname).empty().required(),
    password: Joi.string().pattern(this.re_password).empty().required(),
    confirm: Joi.valid(Joi.ref("password")).empty().required(),
  }).error((err)=>console.log(err)).custom((value, helpers)=>{
    //* 비밀번호에 닉네임이 포함된 경우 처리
    //? 바로 에러 메시지 전달해주는 방식
    return value.password.includes(value.nickname) ? helpers.message({ custom : Message.PASSWORD_INCLUDED_NICKNAM}) : value
    // error.details.context label, key에 객체가 들어가는 상태 : object에 custom 사용해서 그런 것 같다.
    //return value.password.includes(value.nickname) ? helpers.error("any.invalid", { value }, "PASSWORDINCLUDEDNICKNAM") : value
  });

  /**
   * @typedef {object} SchemaPost
   * @property {string} title - 게시글 제목
   * @property {string} content - 게시글 내용
   */

  /**
   * 게시글 생성/수정 유효성 검사 스키마

   * 게시글 제목은 1-20 글자만 가능합니다.
   * 게시글 내용은 0-100 글자만 가능합니다.
   * @member {Joi.ObjectSchema<SchemaPost>} post
   */
  post = Joi.object({
    title: Joi.string().min(1).max(20).empty().required(),
    content: Joi.string().min(0).max(100).required(),
  });

  /**
   * @typedef {object} SchemaComment
   * @property {string} title - 게시글 제목
   * @property {string} content - 게시글 내용
   */

  /**
   * 댓글 생성/수정 유효성 검사 스키마
   * 
   * 댓글은 1-50 글자만 가능합니다. (빈 내용 시 내용을 입력받아야한다.)
   * @member {Joi.ObjectSchema<SchemaComment>} comment
   */
  comment = Joi.object({
    comment: Joi.string().min(1).max(50).empty().required(),
  });
}
//? export 방식
export default new ValidSchema();
