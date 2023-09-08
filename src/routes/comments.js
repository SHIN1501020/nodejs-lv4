/**
 * 댓글 라우터 모듈
 *
 * 이 모듈은 댓글 생성, 조회, 수정, 삭제 관련된 라우트를 처리합니다.
 *
 * @module src/routes/comments.js
 * @namespace CommentsRouter
 */
import express from "express"
import { prisma } from "../utils/prisma/index.js"
import authMiddleware from "../middlewares/authMiddleware.js";
import { validateBody } from "../utils/validation.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import validSchema from "../utils/joi/index.js"

const router = express.Router();

/**
 * 댓글 생성 API - POST '/posts/:postId/comments'
 *
 * @async
 * @function
 * @param {object} req - 요청 객체
 * @param {object} res - 응답 객체
 * @param {function} next - next 미들웨어 함수
 */
router.post("/:postId/comments", authMiddleware, validateBody(validSchema.comment), asyncHandler(async (req, res) => {
      const { postId } = req.params;
      const { userId } = req.user;
      const { comment } = req.body;

      const post = await prisma.posts.findFirst({
        where: {
            postId: postId,
        }
      })

      if(!post) {
        return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다.' });
      }

      await prisma.comments.create({
        data: {
          PostId: postId,
          UserId: userId,
          comment,
        },
      });
  
      return res.status(201).json({ message: "댓글을 작성하였습니다." });
  }));
  
/**
 * 댓글 조회 API - GET '/posts/:postId/comments'
 *
 * @async
 * @function
 * @param {object} req - 요청 객체
 * @param {object} res - 응답 객체
 * @param {function} next - next 미들웨어 함수
 */
  router.get("/:postId/comments", asyncHandler(async (req, res) => {
      const { postId } = req.params;

      const post = await prisma.posts.findFirst({
        where: {
            postId: postId,
        }
      })

      if(!post) {
        return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다.' });
      }
        
  
      const comments = await prisma.comments.findMany({
        where: {
          PostId: postId,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          commentId: true,
          Users: {
            select: {
              userId: true,
              nickname: true,
            }
          },
          comment: true,
          createdAt: true,
          updatedAt: true,
        },
      });
  
      return res.status(200).json({ comments: comments });
  }));
  
/**
 * 댓글 수정 API - GET '/posts/:postId/:commentId'
 *
 * @async
 * @function
 * @param {object} req - 요청 객체
 * @param {object} res - 응답 객체
 * @param {function} next - next 미들웨어 함수
 */
  router.put("/:postId/:commentId", authMiddleware, validateBody(validSchema.comment), asyncHandler(async (req, res) => {
      const { postId, commentId } = req.params;
      const { userId } = req.user
      const { comment } = req.body;

      const post = await prisma.posts.findFirst({
        where: {
            postId: postId,
        }
      })
      if(!post) {
        return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다.' });
      }

      const currentComment = await prisma.comments.findFirst({
        where: {
            PostId: postId,
            commentId: commentId,
        }
      })
      if(!currentComment){
        return res.status(404).json({ errorMessage: '댓글이 존재하지 않습니다.' });
      }

      if(currentComment.UserId !== userId){
        return res.status(403).json({ errorMessage: "댓글 수정 권한이 존재하지 않습니다." });
      }

      //? 위에 선언한 currentComment 그대로 사용할 수 있는 방법은?
      await prisma.comments.update({
        data: { comment },
        where: {
          PostId: postId,
          UserId: userId,
          commentId: commentId,
        },
      });
  
      return res.status(200).json({ message: "댓글을 수정하였습니다." });
  }));
  
/**
 * 댓글 삭제 API - DELETE '/posts/:postId/:commentId'
 *
 * @async
 * @function
 * @param {object} req - 요청 객체
 * @param {object} res - 응답 객체
 * @param {function} next - next 미들웨어 함수
 */
  router.delete("/:postId/:commentId", authMiddleware, asyncHandler(async (req, res) => {
      const { postId, commentId } = req.params;
      const { userId } = req.user

      const post = await prisma.posts.findFirst({
        where: {
            postId: postId,
        }
      })
      if(!post) {
        return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다.' });
      }

      const currentComment = await prisma.comments.findFirst({
        where: {
            PostId: postId,
            commentId: commentId,
        }
      })
      if(!currentComment){
        return res.status(404).json({ errorMessage: '댓글이 존재하지 않습니다.' });
      }

      if(currentComment.UserId !== userId){
        return res.status(403).json({ errorMessage: "댓글 삭제 권한이 존재하지 않습니다." });
      }

      await prisma.comments.delete({
        where: { 
          PostId: postId,
          UserId: userId,
          commentId: commentId, 
        },
      });
    
      return res.status(200).json({ message: "댓글을 삭제하였습니다." });
  }));
  
  export default router;