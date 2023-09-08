export const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next); //* 함수실행
    } catch (error) {
      next(error);
    }
  };
};
