import dotenv from "dotenv";
dotenv.config(); // Call this FIRST before any other imports

import http from "http";
import app from "./app.js";
import initAIWebSocketServer from "./src/ws/initiator.js";
import connectDB from "./src/infra/mongo.db.js"

dotenv.config();


const server = http.createServer(app);

initAIWebSocketServer(server);

server.listen(process.env.PORT || 5001, "0.0.0.0", () => {
    console.log(`✅ 🔱 server is running on port: ${process.env.PORT} bound to 0.0.0.0`);
    connectDB();
});



