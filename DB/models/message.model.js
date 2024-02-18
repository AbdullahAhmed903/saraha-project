import mongoose from "mongoose";


const messageSchema=new mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    reciverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    isdeleted:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})


const messageModel=mongoose.model("Message",messageSchema)
export default messageModel