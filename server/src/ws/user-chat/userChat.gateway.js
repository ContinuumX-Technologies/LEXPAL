
import { authenticateWS } from "../../utils/wsAuth.util.js";
import { registerSocket, unregisterSocket } from "./socketRegistry.js";
import { handleSendMessage } from "./handlers/message.handler.js";
import { handleReadReceipt } from "./handlers/read.handler.js";

export default function userChatGateway(wss) {
  wss.on("connection", async (socket, req) => {
    try {
      // 🔐 authenticate using existing HTTP middleware
       const client_data = authenticateWS(req);

      const userId = client_data.id;
      socket.user_id = userId;

      // 🧠 register socket
      registerSocket(userId, socket);

      socket.on("message", async (raw) => {
        let payload;
        try {
          payload = JSON.parse(raw.toString());
        } catch {
          return;
        }

        if (payload.type === "send_message") {
          await handleSendMessage(socket, payload);
        }

        if (payload.type === "message_read") {
          await handleReadReceipt(socket, payload);
        }
      });

      socket.on("close", () => {
        unregisterSocket(userId, socket);
      });

    } catch (err) {
      socket.close();
    }
  });
}