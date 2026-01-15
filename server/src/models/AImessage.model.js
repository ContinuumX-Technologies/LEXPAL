import mongoose from "mongoose";


const AImessageSchema = mongoose.Schema({
    convo_id: { type: mongoose.Schema.Types.ObjectId, ref: "AIConversation", required: true },
    sender: { type: String, enum: ["AI", "User"], required: true },
    content: { type: String, required: true },
    // Versioning
    versions: [{
        content: { type: String },
        snapshot: [] // Store array of message objects (the "future" that was truncated)
    }],
    currentVersion: { type: Number, default: 0 }
}, { timestamps: true });
AImessageSchema.index({ convo_id: 1, createdAt: -1 });

const AImessage = mongoose.model("AImessage", AImessageSchema);

export default AImessage;

