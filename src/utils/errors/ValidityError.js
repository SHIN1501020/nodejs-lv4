import { CustomError } from "./CustomError.js";
/**
 * 유효성 검사 에러 클래스
 * 
 * 유효성 검사 에러를 처리 위한 클래스입니다.
 * 
 * @class
 * @namespace VALIDITY_ERROR
 */
export class VALIDITY_ERROR extends CustomError {
    /**
     * @constructor
     * @param {number} status - HTTP 상태 코드 
     * @param {string} message - 에러 메시지
     */
    constructor(message) {
        super(412, message);
      }
  }
  