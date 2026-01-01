// controllers/ai/getLatestConversations.js
import AIConversation from "../models/AIConversation.model.js";

export const recentConversationLoader = async (req, res) => {
  try {
    const userId = req.client_data.id;               // Logged-in user's ID
    const userType = req.client_data.user_type;      // "User" or "Lawyer"
    const n = parseInt(req.query.n) || 10;           // Default 10 if not sent

    if (!userId || !userType) {
      return res.status(400).json({ message: "User metadata missing" });
    }

    // Fetch the latest n conversations
    const conversations = await AIConversation.find({
      user_id: userId,
      user_type: userType
    })
      .sort({ createdAt: -1 })   // newest first
      .limit(n)
      .lean();

    // Format response objects
    const formatted = conversations.map(c => ({
      _id: c._id,
      title: c.title || "",
      description: c.description || "",
      timestamp: c.createdAt
    }));

    return res.json({ conversations: formatted });

  } catch (err) {
    console.error("Error loading conversations:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};