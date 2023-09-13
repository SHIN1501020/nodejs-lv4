/**
 * 사용자 인증/인가 미들웨어
 *
 * 이 모듈은 jwt 인증 관련 미들웨어입니다.
 *
 * @module scr/middlewares/auth.js
 * @namespace authMiddleware
 */

import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma/index.js";
import { CustomError } from "../utils/errors/CustomError.js";
import { Message } from "../constants/index.js";

export default async function (req, res, next) {
  try {
    const { Authorization } = req.cookies;
    if(!Authorization) throw new CustomError(403, Message.LOGIN_REQUIRED)

    const [tokenType, token] = Authorization.split(" ");
    if (tokenType !== "Bearer") throw new CustomError(403, Message.COOKIE_ERROR_OCCURRED)

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY); //! 비밀키 .env
    const userId = decodedToken.userId;
    
    const user = await prisma.users.findFirst({
      where: { userId: userId },
    });

    if (!user) {
      res.clearCookie("Authorization");
      throw new CustomError(403, Message.COOKIE_ERROR_OCCURRED)
      // throw new Error("토큰 사용자가 존재하지 않습니다.");
    }

    req.user = user;
    next();
  } catch (error) {
    //? 어떻게 손 봐야할지 모르겠다.
    res.clearCookie("Authorization"); //!쿠기 지우면 값은 없어지는데 'Authorization' 키는 남아있다.
    next(new CustomError(401, Message.COOKIE_ERROR_OCCURRED))
    // switch (error.name) {
    //   case "TokenExpiredError":
    //     return res.status(401).json({ message: "토큰이 만료되었습니다." });
    //   case "JsonWebTokenError":
    //     return res.status(401).json({ message: "토큰이 조작되었습니다." });
    //   default:
    //     return res.status(401).json({ message: error.message ?? "비 정상적인 요청입니다." });
    // }
  }
}
