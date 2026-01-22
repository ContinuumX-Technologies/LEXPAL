import Message from "../../../models/message.model.js";
import { getUserSockets } from "../socketRegistry.js";

/**
 * payload:
 * {
 *   type: "send_message",
 *   receiverId: string,
 *   content: string
 * }
 */
export async function handleSendMessage(socket, payload) {
  const senderId = socket.user_id;
  const { receiverId, content } = payload;

  if (!receiverId || !content) return;

  // 1️⃣ Persist FIRST
  const message = await Message.create({
    sender_id: senderId,
    receiver_id: receiverId,
    content,
  });

  // 2️⃣ Ack sender by sending their msg back to them to update their chat
  socket.send(JSON.stringify({
    type: "incoming_message",
    message: {
      _id: message._id,
      sender_id: senderId,
      content,
      createdAt: message.createdAt,
    },
  }));

  // 3️⃣ Deliver if receiver online
  const receiverSockets = getUserSockets(receiverId);

  if (!receiverSockets) return;

  for (const recvSocket of receiverSockets) {
    recvSocket.send(JSON.stringify({
      type: "incoming_message",
      message: {
        _id: message._id,
        sender_id: senderId,
        content,
        createdAt: message.createdAt,
      },
    }));
  }

  // 4️⃣ Mark delivered
  await Message.updateOne(
    { _id: message._id },
    { delivered_at: new Date() }
  );

  // 5️⃣ Notify sender (✓✓)
  socket.send(JSON.stringify({
    type: "message_delivered",
    messageId: message._id,
  }));
}