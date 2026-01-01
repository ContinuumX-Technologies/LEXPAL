import mongoose from "mongoose";


const AImessageSchema= mongoose.Schema({
    convo_id:{type: mongoose.Schema.Types.ObjectId, ref:"AIConversation", required:true},
    sender:{type:String, enum:["AI","User"], required:true},
    content:{type:String, required:true},

},{timestamps:true});
AImessageSchema.index({ convo_id: 1, createdAt: -1 });

const AImessage=mongoose.model("AImessage",AImessageSchema);

export default AImessage;

