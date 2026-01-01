import mongoose from "mongoose";

const AIConversationSchema = new mongoose.Schema({
  user_type:{type: String, required:true,enum:["User","Lawyer"]},
  user_id: { type: mongoose.Schema.Types.ObjectId, refPath: "user_type", required: true },
  



  title: { type: String, trim: true },
  description:{ type: String, trim:true}

}, { timestamps: true });

const AIConversation=mongoose.model("AIConversation", AIConversationSchema);
export default AIConversation;