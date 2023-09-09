/**
 * 사용자 라우터 모듈
 *
 * 이 모듈은 회원가입, 로그인 관련된 라우트를 처리합니다.
 *
 * @module scr/routes/post
 * @namespace UsersRouter
 */

import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma/index.js";
import { validateBody } from "../middlewares/validation.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import ValidSchema from "../utils/joi/index.js";
import { CustomError } from "../utils/errors/CustomError.js";
import { Message } from "../constants/index.js";

const router = express.Router();

/**
 * 회원가입 API - POST '/signup'
 *
 * @async
 * @param {object} req - 요청 객체
 * @param {object} res - 응답 객체
 * @param {function} next - next 미들웨어 함수
 */
router.post("/signup", validateBody(ValidSchema.signup), asyncHandler(async (req, res, next) => {
    const { nickname, password, confirm } = req.body;

    const isExistUser = await prisma.users.findFirst({
      where: { nickname },
    });

    if (isExistUser) throw new CustomError(412, Message.DUPLICATE_NICKNAME)

    //* 비밀 번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    //* 사용자(user) 생성
    const user = await prisma.users.create({
      data: {
        nickname,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: Message.SIGNUP_SUCCEED });
  })
);

/**
 * 로그인 API - POST '/login'
 *
 * @async
 * @function
 * @param {object} req - 요청 객체
 * @param {object} res - 응답 객체
 * @param {function} next - next 미들웨어 함수
 */
router.post("/login", asyncHandler(async (req, res, next) => {
    const { nickname, password } = req.body;

    const user = await prisma.users.findFirst({ where: { nickname } });
    if (!user) throw new CustomError(412, Message.USER_DOES_NOT_EXIST)

    if (!(await bcrypt.compare(password, user.password))) throw new CustomError(412, Message.USER_DOES_NOT_EXIST)

    const token = jwt.sign(
      {
        userId: user.userId,
      },
      process.env.SECRET_KEY //! 비밀키 .env 파일에 넣어줘야한다
    );

    res.cookie("Authorization", `Bearer ${token}`);
    return res.status(200).json({ message: Message.LOGIN_SUCCEED });
  })
);

export default router;
