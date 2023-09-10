import { Message } from "../constants/index.js";
import { CustomError } from "../utils/errors/CustomError.js";
/**
 * 
 * @function
 * @param {Error} error - 발생한 에러 객체 
 * @param {object} req  - 요청 객체
 * @param {object} res - 응답 객체
 * @param {function} next - next 미들웨어 함수
 * @returns {json} - 에러 메시지
 */

export const errorHandler = (err, req, res, next) => {
  // console.log(error)
  if (err instanceof CustomError) {
    // CustomError 클래스의 인스턴스인 경우, 에러 상태 코드 및 메시지 반환
    return res.status(err.status).json({ errorMessage: err.message });
  }

  // 위에 해당하지 않은 에러의 기본 응답
  return res.status(500).json({ message: Message.INTERNAL_SERVER_ERROR });
};
