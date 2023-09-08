import { CustomError } from "./errors/CustomError.js";

export const errorHandler = (err, req, res, next) => {
    console.log(err.stack)
    if (err instanceof CustomError) {
        return res.status(err.status).json({errorMessage: err.message});
    } 

    if (err.message.includes("is required")) {
        return res.status(400).json({errorMessage: "데이터 형식이 올바르지 않습니다."});
    }

    if(err.name === 'ValidationError'){
        if(err.message.includes("nickname")){
            return res.status(412).json({errorMessage: "닉네임의 형식이 일치하지 않습니다."});
        }
        if(err.message.includes("password")){
            if(err.message.includes("allowed")){
                //? 이거 왜 안될까
                return res.status(412).json({errorMessage: "패스워드에 닉네임이 포함되어 있습니다."});
            }
            return res.status(412).json({errorMessage: "패스워드의 형식이 일치하지 않습니다."});
        }
        if(err.message.includes("title")){
            return res.status(412).json({errorMessage: "게시글 제목의 형식이 일치하지 않습니다."});
        }
        if(err.message.includes("content")){
            return res.status(412).json({errorMessage: "게시글 내용의 형식이 일치하지 않습니다."});
        }
        if(err.message.includes("comment")){
            if(err.message.includes("empty")){
                return res.status(412).json({errorMessage: "댓글 내용을 입력해주세요."});
            }
            return res.status(412).json({errorMessage: "게시글 내용의 형식이 일치하지 않습니다."});
        }
    }
    
    return res.status(500).json({ message: "Internal Server Error "});
}