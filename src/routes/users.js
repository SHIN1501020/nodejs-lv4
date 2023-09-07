/**
 * 사용자 라우터 모듈
 *
 * 이 모듈은 회원가입, 로그인 관련된 라우트를 처리합니다.
 *
 * @module UsersRouter
 */

import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.js"
import { Prisma } from "@prisma/client";

const router = express.Router();

/**
 * 회원가입 API - POST '/sing-up'
 *
 * @async
 * @function
 * @param {object} req - 요청 객체
 * @param {object} res - 응답 객체
 * @param {function} next - next 미들웨어 함수
 */
router.post("/sign-up", async (req, res, next) => {
  try {
    const { nickname, password } = req.body;

    const isExistUser = await prisma.users.findFirst({
      where: { email },
    });
    if (isExistUser) {
      return res.status(409).json({ message: '이미 존재하는 이메일 입니다.' });
    }
  
    //* 비밀 번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);
  
    //* 트랜잭션 리팩토링
    const [user, userInfo] = await prisma.$transaction(async (tx)=>{
          const user = await tx.users.create({
            data: {
              email,
              password: hashedPassword,
            },
          });
        
          const userInfo = await tx.userInfos.create({
            data: {
              UserId: user.userId,
              name,
              age,
              gender: gender.toUpperCase(),
              profileImage,
            },
          });
          return [user, userInfo]
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
    })
    // const user = await prisma.users.create({
    //   data: {
    //     email,
    //     password: hashedPassword,
    //   },
    // });
  
    // const userInfo = await prisma.userInfos.create({
    //   data: {
    //     UserId: user.userId,
    //     name,
    //     age,
    //     gender: gender.toUpperCase(),
    //     profileImage,
    //   },
    // });
  
    return res.status(201).json({ message: '회원가입이 완료되었습니다.' });
  } catch(error) {
    next(error)
  }
 
});

/**
 * 로그인 API - POST '/sign-in'
 *
 * @async
 * @function
 * @param {object} req - 요청 객체
 * @param {object} res - 응답 객체
 * @param {function} next - next 미들웨어 함수
 */
router.post("/sign-in", async (req, res, next) => {
  const { email, password } = req.body;

  const user = await prisma.users.findFirst({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: '존재하지 않는 이메일입니다.' });
  };


  if(!await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' })
  };
  
  const token = jwt.sign(
    { 
    userId: user.userId,
    },
    'customized_secret_key' //! 비밀키 .env 파일에 넣어줘야한다
  )

  res.cookie('authorization', `Bearer ${token}`);
  return res.status(200).json({ message: '로그인 성공했습니다.'})
});

/**
 * 사용자 조회 API - POST '/sign-in'
 *
 * @async
 * @function
 * @param {object} req - 요청 객체
 * @param {object} res - 응답 객체
 * @param {function} next - next 미들웨어 함수
 */
router.get('/users', authMiddleware, async(req, res, next)=>{
    const { userId } = req.user;
    console.log(userId)
    const user = await prisma.users.findFirst({
        where: { userId: +userId},
        select: {
            userId: true,
            email: true,
            password: false,
            createdAt: true,
            UserInfos: { //select join문
                select: {
                    name: true,
                    age: true,
                    gender: true,
                    profileImage: true,

                }
            }
        }
    })
    return res.status(200).json({data: user})
});


/** 사용자 정보 변경 API **/
router.patch('/users/', authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const updatedData = req.body;

    const userInfo = await prisma.userInfos.findFirst({
      where: { UserId: +userId },
    });

    await prisma.$transaction(
      async (tx) => {
        // 트랜잭션 내부에서 사용자 정보를 수정합니다.
        await tx.userInfos.update({
          data: {
            ...updatedData,
          },
          where: {
            UserId: userInfo.UserId,
          },
        });

        // 변경된 필드만 UseHistories 테이블에 저장합니다.
        for (let key in updatedData) {
          if (userInfo[key] !== updatedData[key]) {
            await tx.userHistories.create({
              data: {
                UserId: userInfo.UserId,
                changedField: key,
                oldValue: String(userInfo[key]),
                newValue: String(updatedData[key]),
              },
            });
          }
        }
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      },
    );

    return res
      .status(200)
      .json({ message: '사용자 정보 변경에 성공하였습니다.' });
  } catch (err) {
    next(err);
  }
});

export default router;
