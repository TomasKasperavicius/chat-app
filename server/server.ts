import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app: Express = express();
app.use(cors());
app.use(express.json());
const server = app.listen(process.env.SERVER_PORT, () => {
  if (process.send) {
    process.send(
      `Server running at http://${process.env.DOMAIN_NAME}:${process.env.SERVER_PORT}\n\n`
    );
  }
});
import { Socket, Server } from "socket.io";

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
interface Message {
  sender: string;
  timestamp: number;
  content: string | undefined;
}
io.on("connection", (socket: Socket) => {
  console.log("connected");
  socket.on("message", (message: Message) => {
    socket.broadcast.emit("message", message);
  });
  socket.on("typing", (username: string) => {
    socket.broadcast.emit("typing", username);
  });
  socket.on("stopped typing", (username: string) => {
    socket.broadcast.emit("stopped typing", username);
  });
});
