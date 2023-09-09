/**
 * 라우터 모듈
 * 
 * 이 모듈은 하위 라우터를 조합해 라우팅을 설정합니다.
 * 
 * @module src/routes/index.js
 * @namespace routes
 */
import express from "express";
import UsersRouter from "./users.js";
import PostsRouter from "./posts.js";
import CommentsRouter from "./comments.js";
import LikesRouter from "./likes.js";

const router = express.Router();

router.use("/", UsersRouter);
router.use("/posts", [PostsRouter, CommentsRouter, LikesRouter]);

export default router;
