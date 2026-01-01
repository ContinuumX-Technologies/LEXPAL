import http from "http";
import app from "./app.js";
import  initAIWebSocketServer from "./src/ws/initiator.js";
import connectDB from "./src/infra/mongo.db.js"


const server=http.createServer(app);

initAIWebSocketServer(server);

server.listen(process.env.PORT||5001, () => {
    console.log(`✅ 🔱 server is running on port: ${process.env.PORT}`);
    connectDB();
});



