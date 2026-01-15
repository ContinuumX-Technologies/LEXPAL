import AIConversation from "../../../models/AIConversation.model.js"
import saveChatMessage from "../../../services/conversation/chatPersistence.service.js";
import { generateAIResponse } from "../../../services/ai/ai.service.js";
import generateConversationTitle from "../../../services/ai/titleGenerator.service.js";

export async function handleMessage(socket, raw) {

  console.log('📨 Raw WebSocket data:', raw);
  console.log('📨 Raw WebSocket data as string:', raw.toString());
  const payload = JSON.parse(raw.toString());  //ws msgs are bytecode

  // DECLARE userPrompt with const or let
  const userPrompt = payload.content;  // <-- FIXED HERE
  const messageId = payload.message_id;
  const snapshot = payload.snapshot;

  socket.msg_count++;

  // Save user message
  saveChatMessage({
    convo_id: socket.convo_id,
    sender: "User",
    content: userPrompt,  // <-- Use the declared variable
    message_id: messageId, // Pass ID if it's an edit
    snapshot: snapshot // Pass snapshot for versioning
  });

  // 3️⃣ ASYNC TITLE GENERATION (fire & forget)
  // ─────────────────────────────────────
  if (socket.msg_count === 1 && !socket.convo_title) {
    (async () => {
      try {
        const { title, description } =
          await generateConversationTitle(userPrompt);

        // update DB only if still unset (race-safe)
        const res = await AIConversation.updateOne(
          { _id: socket.convo_id },
          { title, description }
        );

        // update socket context if update succeeded
        if (res.modifiedCount === 1) {
          socket.convo_title = title;

          // optional: inform client
          if (socket.readyState === 1) {
            socket.send(
              JSON.stringify({
                type: "convo_title_updated",
                title,
              })
            );
          }
        }
      } catch (err) {

        console.error('Title generation error:', err.message);
      }
    })();
  }

  // Generate AI response
  const aiText = await generateAIResponse(userPrompt);

  // Save AI message
  saveChatMessage({
    convo_id: socket.convo_id,
    sender: "AI",
    content: aiText,
  });

  // Send AI response to client
  if (socket.readyState === 1) {
    socket.send(
      JSON.stringify({ type: "ai_message", content: aiText })
    );
  }
}