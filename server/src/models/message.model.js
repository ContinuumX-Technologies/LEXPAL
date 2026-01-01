import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    receiver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    // ✓✓ grey — set when delivered to ANY receiver socket
    delivered_at: {
      type: Date,
      default: null,
    },

    // ✓✓ blue — set when receiver explicitly reads
    read_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

/* ─────────────────────────────────────────────
   Indexes (VERY IMPORTANT)
   ───────────────────────────────────────────── */

// Chat history between two users (newest first)
MessageSchema.index({
  sender_id: 1,
  receiver_id: 1,
  createdAt: -1,
});

// Reverse direction (receiver → sender)
MessageSchema.index({
  receiver_id: 1,
  sender_id: 1,
  createdAt: -1,
});

// Unread messages for a user
MessageSchema.index({
  receiver_id: 1,
  read_at: 1,
});

export default mongoose.model("Message", MessageSchema);