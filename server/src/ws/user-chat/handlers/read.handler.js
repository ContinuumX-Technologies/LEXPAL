import Message from "../../../models/message.model.js";
import { getUserSockets } from "../socketRegistry.js";

/**
 * payload:
 * {
 *   type: "message_read",
 *   messageId: string
 * }
 */
export async function handleReadReceipt(socket, payload) {
  const readerId = socket.user_id;
  const { messageId } = payload;

  if (!messageId) return;

  const message = await Message.findById(messageId);
  if (!message) return;

  // only receiver can mark read
  if (String(message.receiver_id) !== readerId) return;

  if (message.read_at) return;

  // mark read
  message.read_at = new Date();
  await message.save();

  // notify sender
  const senderSockets = getUserSockets(
    String(message.sender_id)
  );

  if (!senderSockets) return;

  for (const senderSocket of senderSockets) {
    senderSocket.send(JSON.stringify({
      type: "message_read",
      messageId,
    }));
  }
}