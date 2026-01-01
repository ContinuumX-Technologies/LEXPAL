import { authenticateWS } from "../../utils/wsAuth.util.js";
import { handleMessage } from "./handlers/message.handler.js";
import resolveConversation from "../../services/conversation/convoResolver.service.js";
import AIConversation from "../../models/AIConversation.model.js";
import { URL } from "url";

export default function chatGateway(wss) {
  wss.on("connection", async (socket, req) => {
    try {
      // 1️⃣ AUTH
      const client_data = authenticateWS(req);
      socket.client_data = client_data;
      socket.msg_count = 0;

      // 2️⃣ QUERY PARAMS
      const url = new URL(req.url, `http://${req.headers.host}`);
      const convoId = url.searchParams.get("convo_id");

      let convo;

      if (convoId=="new") {
        convo = await AIConversation.create({
          user_id: client_data.id,
          user_type: client_data.user_type,
          title: null,
          description: null,
        });
      } else {
        convo = await resolveConversation({
          convoId,
          userId: client_data.id,
        });
      }

      // 3️⃣ ATTACH CONTEXT
      socket.convo_id = convo._id.toString();
      if(convo.title!=null)socket.convo_title = convo.title;

      // 4️⃣ MESSAGE HANDLER
      socket.on("message", (data) => {
        handleMessage(socket, data);
      });

    } catch (err) {
      socket.close(1008, "Unauthorized");
    }
  });
}