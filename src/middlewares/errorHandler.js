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

export const errorHandler = (error, req, res, next) => {
  console.log(error.stack);
  if (error instanceof CustomError) {
    // CustomError 클래스의 인스턴스인 경우, 에러 상태 코드 및 메시지 반환
    return res.status(error.status).json({ errorMessage: error.message });
  }

  switch(error.name){
    // joi 유효성 검사 에러 처리
    case "ValidationError":{
      if(error.message.includes("required")) 
        return res.status(400).json({ errorMessage: Message.BAD_REQUEST })

      if(error.message.includes("nickname"))
        return res.status(412).json({ errorMessage: Message.NICKNAME_FORMAT_MISMATCH });

      if(error.message.includes("password"))
        return res.status(412).json({ errorMessage: Message.PASSWORD_FORMAT_MISMATCH });

      if(error.message.includes("value")) //joi custom
        return res.status(412).json({ errorMessage: Message.PASSWORD_INCLUDED_NICKNAM });

      if(error.message.includes("title"))
        return res.status(412).json({ errorMessage: Message.POST_TITLE_FORMAT_MISMATCH });

      if(error.message.includes("content"))
        return res.status(412).json({ errorMessage: Message.POST_CONTETN_FORMAT_MISMATCH });

      if(error.message.includes("comment")) {
        if(error.message.includes("empty"))
          return res.status(412).json({ errorMessage: Message.COMMENT_EMPTY });
        return res.status(412).json({ errorMessage: Message.COMMENT_COMMENT_FORMAT_MISMATCH });
      }
    }
  }
  // 위에 해당하지 않은 에러의 기본 응답
  return res.status(500).json({ message: Message.INTERNAL_SERVER_ERROR });
};
