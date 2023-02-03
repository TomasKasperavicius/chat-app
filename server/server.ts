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
import { Socket, Server, RemoteSocket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
interface Message {
  sender: string;
  receiver?: string;
  timestamp: number;
  content: string | undefined;
}
export interface UserInfo {
  username: string;
  avatar: string;
  socketID: string;
}
const fetchConnectedUsers = async () => {
  const allSockets: RemoteSocket<DefaultEventsMap, any>[] =
    await io.sockets.fetchSockets();
  var connectedUsers: UserInfo[] = [];
  allSockets.forEach((socket) => {
    connectedUsers.push({
      avatar: socket.handshake.query.avatar as string,
      username: socket.handshake.query.username as string,
      socketID: socket.id,
    });
  });
  return connectedUsers;
};
io.on("connection", async (socket: Socket) => {
  console.log("connected");
  var connectedUsers = await fetchConnectedUsers();
  io.sockets.emit("update connected users", connectedUsers);
  socket.on("disconnect", (_: unknown) => {
    socket.broadcast.emit("user disconnect", socket.id);
  });
  socket.on("message", (message: Message) => {
    socket.broadcast.emit("message", message);
  });
  socket.on(
    "send friend request",
    (receiverSocketID: string, sender: UserInfo) => {
      socket.to(receiverSocketID).emit("received friend request", sender,socket.id);
    }
  );
  socket.on(
    "cancel friend request",
    (receiverSocketID: string) => {
      socket.to(receiverSocketID).emit("friend request canceled",socket.id);
    }
  );
  socket.on(
    "accept friend request",
    (sender: UserInfo,receiverSocketID: string) => {
      socket.to(receiverSocketID).emit("friend request accepted",sender,socket.id);
    }
  );
  socket.on("update connected users", (message: Message) => {
    socket.broadcast.emit("message", message);
  });
  socket.on("private message", (anotherSocketId: string, message: Message) => {
    socket.to(anotherSocketId).emit("private message", socket.id, message);
  });
  socket.on("typing", (username: string) => {
    socket.broadcast.emit("typing", username);
  });
  socket.on("stopped typing", (username: string) => {
    socket.broadcast.emit("stopped typing", username);
  });
});
