import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config()
const app: Express = express();
app.use(cors());
app.use(express.json());
const server = app.listen(process.env.SERVER_PORT, () => {
  if (process.send) {
    process.send(
      `Server running at http://localhost:${process.env.SERVER_PORT}\n\n`
    );
  }
});
import { Socket, Server } from "socket.io";

const io = new Server(server, {
  cors: {
    origin: "*",
  }
});
interface Message {
  sender: string;
  timestamp: number;
  content: string | undefined;
}
io.on("connection", (socket: Socket) => {
  console.log("connected")
  socket.on("message", (message:Message) => {
    console.log(message);
    socket.broadcast.emit("message", message);
  });
});

