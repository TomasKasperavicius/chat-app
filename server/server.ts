import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import connectToDB from "./mongodb";
import socketHandler from "./sockets";
import authRoutes from "./Routes/AuthRouter";
import chatRoomRoutes from "./Routes/ChatRoomRouter";

dotenv.config();

const app: Express = express();
app.use(cors());
app.use(express.json());

(() => connectToDB(process.env.MONGO_URI as string))();

app.use("/auth", authRoutes);
app.use("/chatrooms", chatRoomRoutes);

const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*",
  },
});

socketHandler(io);

const PORT = process.env.SERVER_PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
