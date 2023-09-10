import { CustomError } from "./CustomError.js";
/**
 * 데이터 형식 에러(Bad Request) 클래스
 * 
 * 데이터 형식 에러(Bad Request)를 처리하기 위한 클래스입니다.
 * 
 * @class
 * @namespace BAD_REQUEST
 */
export class BAD_REQUEST extends CustomError {
  constructor(message) {
    super(400, message);
  }
}