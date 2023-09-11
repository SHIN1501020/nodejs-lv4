/**
 * 라우터 모듈
 * 
 * 이 모듈은 하위 라우터를 조합해 라우팅을 설정합니다.
 * 
 * @module src/routes/index.js
 * @namespace routes
 */
import express from "express";
import usersRouter from "./users.js";
import postsRouter from "./posts.js";
import commentsRouter from "./comments.js";
import likesRouter from "./likes.js";

const router = express.Router();

router.use("/", usersRouter);
router.use("/posts", [likesRouter, postsRouter, commentsRouter]); // likesRouter를 앞으로

export default router;
