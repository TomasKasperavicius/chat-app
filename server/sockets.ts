import { Server as SocketIOServer, Socket, RemoteSocket } from "socket.io";
import { UserInfo, Message } from "./interfaces";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const fetchConnectedUsers = async (io: SocketIOServer): Promise<UserInfo[]> => {
  const allSockets: RemoteSocket<DefaultEventsMap, any>[] =
    await io.sockets.fetchSockets();
  var connectedUsers: UserInfo[] = [];
  allSockets.forEach((socket) => {
    connectedUsers.push({
      _id: socket.handshake.query._id as string,
      avatar: socket.handshake.query.avatar as string,
      email: socket.handshake.query.email as string,
      username: socket.handshake.query.username as string,
      socketID: socket.id,
      password: "",
    });
  });
  return connectedUsers;
};

const socketHandler = (io: SocketIOServer): void => {
  io.on("connection", async (socket: Socket) => {

    const connectedUsers = await fetchConnectedUsers(io);
    io.emit("update connected users", connectedUsers);

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
    });

    socket.on("message", async (roomId, message) => {
      io.to(roomId).emit("message", message);
    });

    socket.on(
      "send friend request",
      (receiverSocketID: string, sender: UserInfo) => {
        socket
          .to(receiverSocketID)
          .emit("received friend request", sender, socket.id);
      }
    );
    socket.on(
      "accept friend request",
      (sender, receiverSocketID: string) => {
        socket
          .to(receiverSocketID)
          .emit("friend request accepted", sender, socket.id);
      }
    );
    socket.on("cancel friend request", (receiverSocketID: string) => {
      socket.to(receiverSocketID).emit("friend request canceled", socket.id);
    });
    socket.on("typing", (username: string, roomId: string) => {
      socket.to(roomId).emit("typing", username);
    });
    socket.on("stopped typing", (username: string, roomId: string) => {
      socket.to(roomId).emit("stopped typing", username);
    });
    socket.on("disconnect", () => {
      io.emit("user disconnected", socket.id);
    });
  });
};

export default socketHandler;
