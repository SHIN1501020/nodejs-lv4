import Joi from "joi";

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
  joi = Joi.defaults((schema)=> schema.options({
    messages: {
        'any.required' : '데이터 형식이 올바르지 않습니다.',
        'string.pattern.base': '{#label} 형식이 일치하지 않습니다.',
        'any.only': '비밀번호가 일치하지 않습니다.',
        'string.empty': '{#label} 내용을 입력해주세요.'
      },
      errors:{
        wrap : {
          label: false //라벨에서 "" 출력되는거 제거
        }
      }
  }));  


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
  signup = this.joi.object({
    nickname: this.joi.string().pattern(/^[a-zA-Z0-9]{3,10}$/).empty('').allow('').required().label("닉네임"),
    password: this.joi.string().pattern(/^[a-zA-Z0-9]{4,30}$/).empty('').allow('').required().label("비밀번호"),
    confirm: this.joi.valid(this.joi.ref("password")).empty('').allow('').required().label("비밀번호"),
  }).custom((value, helpers)=>{
    //* 비밀번호에 닉네임이 포함된 경우 처리
    //? 바로 에러 메시지 전달해주는 방식
    return value.password.includes(value.nickname) ? helpers.message({ custom : "패스워드에 닉네임이 포함되어 있습니다."}) : value
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
  post = this.joi.object({
    title: this.joi.string().pattern(/^.{1,10}$/).empty('').allow('').required().label("제목"),
    content: this.joi.string().pattern(/^.{0,50}$/).empty('').allow('').required().label("내용"),
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
  comment = this.joi.object({
    comment: this.joi.string().pattern(/^.{1,20}$/).required().label("댓글"),
  });
}
//? export 방식
export default new ValidSchema();
