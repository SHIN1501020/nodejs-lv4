/**
 * 게시글 라우터 모듈
 *
 * 이 모듈은 게시글 생성, 조회, 상세 조회, 수정, 삭제 관련된 라우트를 처리합니다.
 *
 * @module src/routes/post.js
 * @namespace PostsRouter
 */

import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { validateBody } from "../utils/validation.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import validSchema from "../utils/joi/index.js"

const router = express.Router();

/**
 * 게시글 생성 API - POST '/posts'
 *
 * @async
 * @function
 * @param {object} req - 요청 객체
 * @param {object} res - 응답 객체
 * @param {function} next - next 미들웨어 함수
 */
router.post("/", authMiddleware, validateBody(validSchema.post), asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const { title, content } = req.body;

    await prisma.posts.create({
      data: {
        UserId: userId,
        title,
        content,
      },
    });

    return res.status(201).json({ message: "게시글을 생성하였습니다." });
}));

/**
 * 게시글 조회 API - GET '/posts'
 *
 * @async
 * @function
 * @param {object} req - 요청 객체
 * @param {object} res - 응답 객체
 * @param {function} next - next 미들웨어 함수
 */
router.get("/", asyncHandler(async (req, res) => {
  const posts = await prisma.posts.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      postId: true,
      Users: {
        select: {
            userId: true,
            nickname: true
        }
      },
      title: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return res.status(200).json({ posts: posts });
}));

/**
 * 게시글 상세 조회 API - GET '/posts/:postId'
 *
 * @async
 * @function
 * @param {object} req - 요청 객체
 * @param {object} res - 응답 객체
 * @param {function} next - next 미들웨어 함수
 */
router.get("/:postId", asyncHandler(async (req, res) => {
    const { postId } = req.params;

    const currentPost = await prisma.posts.findFirst({
      where: { postId: postId },
      select: {
        postId: true,
        Users: {
            select: {
                userId: true,
                nickname: true
            }
        },
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!currentPost) {
      return res.status(404).json({ errorMessage: "게시글 조회에 실패하였습니다." });
    }

    return res.status(200).json({ post: currentPost });
}));

/**
 * 게시글 수정 API - PUT '/posts/:postId'
 *
 * @async
 * @function
 * @param {object} req - 요청 객체
 * @param {object} res - 응답 객체
 * @param {function} next - next 미들웨어 함수
 */
router.put("/:postId", authMiddleware, validateBody(validSchema.post), asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.user;
    const { title, content } = req.body;

    const currentPost = await prisma.posts.findUnique({
      where: {
        postId: postId,
      },
    });

    if (!currentPost) {
      return res.status(404).json({ errorMessage: "게시글 조회에 실패하였습니다." });
    }

    if(currentPost.UserId !== userId){
      return res.status(403).json({ errorMessage: "게시글 수정 권한이 존재하지 않습니다." });
    }

    await prisma.posts.update({
      data: { 
        title, content 
      },
      where: {
        postId: postId,
      },
    });

    return res.status(200).json({ message: "게시글을 수정하였습니다." });
}));

/**
 * 게시글 수정 API - DELETE '/posts/:postId'
 *
 * @async
 * @function
 * @param {object} req - 요청 객체
 * @param {object} res - 응답 객체
 * @param {function} next - next 미들웨어 함수
 */
router.delete("/:postId", authMiddleware, asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.user;

    const currentPost = await prisma.posts.findFirst({
      where: { postId: postId },
    });

    if (!currentPost) {
      return res.status(404).json({ message: "게시글 조회에 실패하였습니다." });
    }

    if(currentPost.UserId !== userId){
      return res.status(403).json({ errorMessage: "게시글 삭제 권한이 존재하지 않습니다." });
    }

    await prisma.posts.delete({ 
    where: { 
        postId: postId
    } });

    return res.status(200).json({ message: "게시글을 삭제하였습니다." });
}));

export default router;
