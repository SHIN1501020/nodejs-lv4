/**
 * 게시글 라우터 모듈
 *
 * 이 모듈은 게시글 생성, 조회, 상세 조회 관련된 라우트를 처리합니다.
 *
 * @module src/routes/post
 * @namespace PostsRouter
 */

import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/authMiddleware.js";

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
router.post("/", authMiddleware, async (req, res) => {
  try {
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
  } catch (err) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

/**
 * 게시글 조회 API - GET '/posts'
 *
 * @async
 * @function
 * @param {object} req - 요청 객체
 * @param {object} res - 응답 객체
 * @param {function} next - next 미들웨어 함수
 */
router.get("/", async (req, res) => {
  const posts = await prisma.posts.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      postId: true,
      User: {
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
});

/**
 * 게시글 상세 조회 API - GET '/posts/:postId'
 *
 * @async
 * @function
 * @param {object} req - 요청 객체
 * @param {object} res - 응답 객체
 * @param {function} next - next 미들웨어 함수
 */
router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    const currentPost = await prisma.posts.findFirst({
      where: { postId: postId },
      select: {
        postId: true,
        User: {
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
      return res.status(404).json({ message: "게시글 조회에 실패하였습니다." });
    }

    return res.status(200).json({ data: currentPost });
  } catch (err) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

/**
 * 게시글 수정 API - PUT '/posts/:postId'
 *
 * @async
 * @function
 * @param {object} req - 요청 객체
 * @param {object} res - 응답 객체
 * @param {function} next - next 미들웨어 함수
 */
router.put("/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content } = req.body;

    const currentPost = await prisma.posts.findUnique({
      where: {
        postId: postId,
      },
    });

    if (!currentPost) {
      return res.status(404).json({ message: "게시글 조회에 실패하였습니다." });
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
  } catch (err) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

/**
 * 게시글 수정 API - DELETE '/posts/:postId'
 *
 * @async
 * @function
 * @param {object} req - 요청 객체
 * @param {object} res - 응답 객체
 * @param {function} next - next 미들웨어 함수
 */
router.delete("/:_postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;

    const currentPost = await prisma.posts.findFirst({
      where: { postId: postId },
    });

    if (!currentPost) {
      return res.status(404).json({ message: "게시글 조회에 실패하였습니다." });
    }

    await prisma.posts.delete({ 
    where: { 
        postId: postId
    } });

    return res.status(200).json({ message: "게시글을 삭제하였습니다." });
  } catch (err) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

export default router;
