import { WebSocketServer } from "ws";
import chatGateway from "./ai-chat/chat.gateway.js";
import userChatGateway from "./user-chat/userChat.gateway.js";

export default function initAIWebSocketServer(server) {
  const AIwss = new WebSocketServer({ noServer: true });
  const Chatwss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (req, socket, head) => {
    if (req.url.startsWith("/ws/ai-chat")) {
      AIwss.handleUpgrade(req, socket, head, (ws) => {
        AIwss.emit("connection", ws, req);
      });
    } else if (req.url.startsWith("/ws/user-chat")) {
      Chatwss.handleUpgrade(req, socket, head, (ws) => {
        Chatwss.emit("connection", ws, req);
      });
    } else {
      socket.destroy();
    }
  });

  chatGateway(AIwss);
  userChatGateway(Chatwss);
}