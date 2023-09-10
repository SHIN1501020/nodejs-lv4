/**
 * @function
 * @param {function} fn - 비동기 함수 
 * @returns {function} - 미들웨어 함수 반환
 */
export const asyncHandler = (fn) => {
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
      await fn(req, res, next); //* 함수실행
    } catch (err) {
      next(err);
    }
  };
};
