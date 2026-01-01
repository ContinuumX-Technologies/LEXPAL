import AImessage from "../models/AImessage.model.js";

/**
 * GET /api/ai/chat/history/:convoId
 *
 * Query params:
 *  - cursor (optional): ISO timestamp
 *  - limit (optional): number (default 10, max 50)
 */
export async function getConversationHistory(req, res) {
  try {
    const { convoId } = req.params;

    if (!convoId) {
      return res.status(400).json({ error: "Missing conversation ID" });
    }

    // pagination params
    const limit = Math.min(
      parseInt(req.query.limit, 10) || 10,
      50
    );

    const cursor = req.query.cursor
      ? new Date(req.query.cursor)
      : null;

    // base query
    const query = {
      convo_id: convoId,
    };

    // cursor-based pagination (older messages)
    if (cursor) {
      query.createdAt = { $lt: cursor };
    }

    /**
     * Fetch messages newest → oldest
     * (we reverse later for correct display order)
     */
    const messages = await AImessage.find(query)
      .sort({ createdAt: -1 })
      .limit(limit + 1) // +1 to check if more exists
      .lean();

    const hasMore = messages.length > limit;

    // remove extra record used for hasMore check
    if (hasMore) messages.pop();

    // reverse → oldest → newest
    messages.reverse();

    // prepare next cursor (oldest message timestamp)
    const nextCursor =
      messages.length > 0
        ? messages[0].createdAt
        : null;

    return res.json({
      messages: messages.map((m) => ({
        sender: m.sender,
        content: m.content,
        createdAt: m.createdAt,
      })),
      nextCursor,
      hasMore,
    });
  } catch (err) {
    console.error("Conversation history error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}