import AIConversation from "../../models/AIConversation.model.js";



/**
 * Ensures:
 * - conversation exists
 * - belongs to user
 * - creates new one if missing
 */
export default async function resolveConversation({
  convoId,
  userId,
}) {
  // ─────────────────────────────────────
  // CASE 1: Existing conversation requested
  // ─────────────────────────────────────
  
    const convo = await AIConversation.findById(convoId);

    if (!convo) {
      throw new Error("Conversation not found");
    }

    if (convo.user_id.toString() !== userId) {
      throw new Error("Unauthorized conversation access");
    }

    return convo;
  

//   // ─────────────────────────────────────
//   // CASE 2: Create new conversation
//   // ─────────────────────────────────────
//   const newConvo = await AIConversation.create({
//     user_id: userId,
//     title: null,
//   });

//   return newConvo;
}