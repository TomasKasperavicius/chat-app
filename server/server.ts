import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectToDB from "./mongodb";
import ChatRoom from "./Schemas/ChatRoom";

dotenv.config();
const app: Express = express();
app.use(cors());
app.use(express.json());
(async () => await connectToDB("mongodb://localhost/Chat-app"))();
app.post("/addPrivateChatRoom", async (req: Request, res: Response) => {
  try {
    const {owner,type,participants} = req.body
    const chatRoom = new ChatRoom({owner:owner,type:type,participants:participants});
    await chatRoom.save();
    await User.findByIdAndUpdate(participants[0],{$push:{friends:participants[1],chatRoom:chatRoom}}).exec()
    await User.findByIdAndUpdate(participants[1],{$push:{friends:participants[0],chatRoom:chatRoom}}).exec()
    res.status(200).json(chatRoom);
  } catch (error) {
    res.status(500).json(error)
  }
});
app.post("/addUser", async (req: Request, res: Response) => {
  try {
    const {avatar, username} : UserInfo = req.body;
    const user = new User({avatar:avatar,username:username});
    await user.save();
    res.status(200).json(user);
    
  } catch (error) {
    res.status(500).json(error)
  }
});
app.get("/chatRoom/:id", async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const chatRoom = await ChatRoom.findById(id)
    res.status(200).json(chatRoom);
  } catch (error) {
    res.status(500).json(error)
  }
});
const server = app.listen(process.env.SERVER_PORT, () => {
  if (process.send) {
    process.send(
      `Server running at http://${process.env.DOMAIN_NAME}:${process.env.SERVER_PORT}\n\n`
    );
  }
});
import { Socket, Server, RemoteSocket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import User from "./Schemas/User";

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
  socketID?: string;
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
    (receiverSocketID: string, sender) => {
      socket
        .to(receiverSocketID)
        .emit("received friend request", sender, socket.id);
    }
  );
  socket.on("cancel friend request", (receiverSocketID: string) => {
    socket.to(receiverSocketID).emit("friend request canceled", socket.id);
  });
  socket.on(
    "accept friend request",
    (sender, receiverSocketID: string,privateChatRoom) => {
      console.log(sender);
      socket
        .to(receiverSocketID)
        .emit("friend request accepted", sender, socket.id,privateChatRoom);
    }
  );
  socket.on("update connected users", (message: Message) => {
    socket.broadcast.emit("message", message);
  });
  socket.on('joinRoom', (roomId) => {
    console.log("joined");
    socket.join(roomId);
  });
  socket.on('sendMessage', (chatRoom,message) => {
    console.log(chatRoom,message);
    socket.to(chatRoom._id).emit('receivedMessage', message);
  });
  socket.on("typing", (username: string) => {
    socket.broadcast.emit("typing", username);
  });
  socket.on("stopped typing", (username: string) => {
    socket.broadcast.emit("stopped typing", username);
  });
});

