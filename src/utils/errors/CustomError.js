/**
 * 커스텀 에러 클래스
 * 
 * 커스텀 에러를 처리하기 위한 클래스입니다.
 * 
 * @class
 * @namespace CustomError
 */
export class CustomError extends Error {
  /**
   * @constructor
   * @param {number} status - HTTP 상태 코드 
   * @param {string} message - 에러 메시지
   */
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
