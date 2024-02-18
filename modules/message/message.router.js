import { Router } from "express";
import { auth } from "../../middleware/auth.js";
const messageRouter=Router();
import * as messages from "./controller/message.js"

messageRouter.post("/:reciverId",messages.sendmessage)

messageRouter.get("/messageList",messages.allmessage)
messageRouter.delete("/deletemessage/:id",auth(),messages.deletemessage)

export default messageRouter