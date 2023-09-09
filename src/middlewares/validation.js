/**
 * 
 * @param {Joi.ObjectSchema} schema 
 * @returns {function} - 미들웨어 함수 반환
 */
export const validateBody = (schema) => {
  /**
   * 미들웨어 함수
   * 
   * @async
   * @function
   * @param {object} req - 요청 객체
   * @param {object} res - 응답 객체
   * @param {function} next - next 미들웨어 함수
   */
  return async (req, res, next) => {
    try {
      // req.body를 스키마로 유효성 검사하고 유효하면 req.body 업데이트
      const validatedBody = await schema.validateAsync(req.body);
      req.body = validatedBody;
      next();
    } catch (err) {
      next(err);
    }
  };
};
