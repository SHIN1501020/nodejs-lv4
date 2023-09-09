import express from "express";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { errorHandler } from "./middlewares/errorHandler.js";

config();
const app = express();
const PORT = process.env.PORT;

// Express에서 req.body에 접근하여 body 데이터를 사용할 수 있도록 설정합니다.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// cookieParser 설정
app.use(cookieParser());

// 라우터 설정
const router = express.Router();

// 메인 화면
router.get("/", (req, res) => {
  return res.json({ message: "Hi!" });
});

app.use("/api", [router, routes]);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
