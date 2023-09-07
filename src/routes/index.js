import express from "express";
import UsersRouter from "./users.js";
import PostsRouter from "./posts.js";
// import CommentsRouter from "./comments.js";

const router = express.Router();

router.use("/", UsersRouter);
router.use("/posts", [PostsRouter]);

export default router;
