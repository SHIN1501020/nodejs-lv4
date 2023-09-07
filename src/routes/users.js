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

const router = express.Router();

/**
 * 회원가입 API - POST '/signup'
 *
 * @async
 * @function
 * @param {object} req - 요청 객체
 * @param {object} res - 응답 객체
 * @param {function} next - next 미들웨어 함수
 */
router.post("/signup", async (req, res, next) => {
  try {
    const { nickname, password, confirm } = req.body;

    const isExistUser = await prisma.users.findFirst({
      where: { nickname },
    });
    if (isExistUser) {
      return res.status(409).json({ message: "중복된 닉네임 입니다." });
    }

    //* 비밀 번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    //* 사용자(user) 생성
    const user = await prisma.users.create({
      data: {
        nickname,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: "회원가입이 완료되었습니다." });
  } catch (error) {
    next(error);
  }
});

/**
 * 로그인 API - POST '/login'
 *
 * @async
 * @function
 * @param {object} req - 요청 객체
 * @param {object} res - 응답 객체
 * @param {function} next - next 미들웨어 함수
 */
router.post("/login", async (req, res, next) => {
  const { nickname, password } = req.body;

  const user = await prisma.users.findFirst({ where: { nickname } });
  if (!user) {
    return res.status(401).json({ message: "닉네임 또는 패스워드를 확인해주세요." });
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "닉네임 또는 패스워드를 확인해주세요." });
  }

  const token = jwt.sign(
    {
      userId: user.userId,
    },
    process.env.SECRET_KEY //! 비밀키 .env 파일에 넣어줘야한다
  );

  res.cookie("Authorization", `Bearer ${token}`);
  return res.status(200).json({ message: "로그인 성공했습니다." });
});


export default router;
