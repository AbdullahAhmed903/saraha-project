import connectionDB from "../DB/connection.js";
import authRouter from "./auth/auth.router.js";
import userRouter from "./user/user.router.js";
import messageRouter from "./message/message.router.js";


export {connectionDB,authRouter,messageRouter,userRouter}