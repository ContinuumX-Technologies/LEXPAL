import Message from "../models/message.model.js";

/**
 * GET /api/chat/history/:receiverId?cursor=<ISO_DATE>
 */
export async function getChatHistory(req, res) {
  try {
    const userId = req.client_data.id;
    const receiverId = req.params.receiverId;
    const { cursor } = req.query;

    const limit = 10;

    const query = {
      $or: [
        { sender_id: userId, receiver_id: receiverId },
        { sender_id: receiverId, receiver_id: userId },
      ],
    };

    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    // 0️⃣ Mark invalid/unread messages as read
    await Message.updateMany(
      { sender_id: receiverId, receiver_id: userId, read_at: null },
      { $set: { read_at: new Date() } }
    );

    // fetch newest first
    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(limit + 1);

    const hasMore = messages.length > limit;
    if (hasMore) messages.pop();

    // return oldest → newest
    messages.reverse();

    const nextCursor =
      messages.length > 0
        ? messages[0].createdAt
        : null;

    res.json({
      messages,
      hasMore,
      nextCursor,
    });
  } catch (err) {
    console.error("Chat history error:", err);
    res.status(500).json({ error: "Server error" });
  }
}