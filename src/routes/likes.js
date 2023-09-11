/**
 * 좋아요 라우터 모듈
 *
 * 이 모듈은 게시글에 대해 좋아요를 조회 및 수정과 관련된 라우트를 처리합니다.
 *
 * @module src/routes/likes.js
 * @namespace LikesRouter
 */
import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { CustomError } from "../utils/errors/CustomError.js";
import { Message } from "../constants/index.js";

const router = express.Router();

router.post('/:postId/like', authMiddleware, asyncHandler(async(req, res, next)=>{
    const { userId } = req.user;
    const { postId } = req.params;
    
    const post = await prisma.posts.findUnique({
        where: {
          postId: postId,
        },
      });
  
      if (!post) throw new CustomError(404, Message.POST_DOES_NOT_EXIST)

      const isLike = await prisma.likes.findFirst({
        where: {
            UserId: userId,
            PostId: postId,
        }
      })
      //* '좋아요' 안했으면 좋아요 등록
      if(!isLike){
        await prisma.likes.create({
            data:{
                UserId: userId,
                PostId: postId,
            }
        })
        return res.status(200).json({ message: Message.POST_LIKE})
      }
      //* '좋아요' 취소
      await prisma.likes.delete({
        where: {
            likeId: isLike.likeId,
            UserId: userId,
            PostId: postId
        }
      })
      return res.status(200).json({ message: Message.POST_UNLIKE})
}));

router.get('/like', authMiddleware, asyncHandler(async (req, res, next)=>{
    const { userId } = req.user;
    const posts = await prisma.posts.findMany({
        where:{
            Likes: {
                some: {
                    UserId: userId
                }
            }
        },
        select: {
            postId: true,
            Users: {
                select: {
                    userId: true,
                    nickname: true,
                },
            },
            title: true,
            createdAt: true,
            updatedAt: true,
            //* Likes 개수 구하기
            _count: {
                select: {
                    Likes: true,
                }
            },
        },
        //* _count로 내림차순 정렬
        orderBy: {
            Likes: {
                _count: "desc",
            }
        }
    })
    return res.status(200).json({ posts: posts});
}));

export default router;