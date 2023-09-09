import { Message } from "../constants/index.js";
import { CustomError } from "../utils/errors/CustomError.js";


export const errorHandler = (error, req, res, next) => {
  // console.log(error.stack);
  if (error instanceof CustomError) {
    return res.status(err.status).json({ errorMessage: err.message });
  }
  //////joi 에러 처리
  //// switch (error.name){
  ////   case "ValidationError":{
  ////     return res.status(412).json({ errorMessage: error.message})
  ////  }
  //// }
  switch(error.name){
    case "ValidationError":{
      if(error.message.includes("required")) 
        return res.status(400).json({ errorMessage: Message.BAD_REQUEST })

      if(error.message.includes("nickname"))
        return res.status(412).json({ errorMessage: Message.NICKNAME_FORMAT_MISMATCH });

      if(error.message.includes("password"))
        return res.status(412).json({ errorMessage: Message.PASSWORD_FORMAT_MISMATCH });

      if(error.message.includes("value")) //joi custom
        return res.status(412).json({ errorMessage: Message.PASSWORD_INCLUDED_NICKNAM });

      if(error.message.includes("title"))
        return res.status(412).json({ errorMessage: Message.POST_TITLE_FORMAT_MISMATCH });

      if(error.message.includes("content"))
        return res.status(412).json({ errorMessage: Message.POST_CONTETN_FORMAT_MISMATCH });

      if(error.message.includes("comment")) {
        if(error.message.includes("empty"))
          return res.status(412).json({ errorMessage: Message.COMMENT_EMPTY });
        return res.status(412).json({ errorMessage: Message.COMMENT_COMMENT_FORMAT_MISMATCH });
      }
    }
  }

  return res.status(500).json({ message: Message.INTERNAL_SERVER_ERROR });
};
