import { ChatRoomDefinition } from "@/components/ChatRoom";
import Login from "@/components/Login";
import { FunctionComponent } from "react";
import { SocketWithUser, UserDefinition } from "..";
interface LoginInterface{
  socket: SocketWithUser | undefined;
  setChatRooms: React.Dispatch<React.SetStateAction<ChatRoomDefinition[]>>;
  setFriends: React.Dispatch<React.SetStateAction<UserDefinition[]>>;
  setSocket: React.Dispatch<React.SetStateAction<SocketWithUser | undefined>>;
  setTypingUsers: React.Dispatch<React.SetStateAction<string[]>>;
  setConnectedUsers: React.Dispatch<React.SetStateAction<UserDefinition[]>>;
  setNotifications: React.Dispatch<
    React.SetStateAction<FunctionComponent<{}>[]>
  >;
  setSeenNewNotifications: React.Dispatch<React.SetStateAction<boolean>>;
}
const LoginPage: FunctionComponent<LoginInterface> = ({socket,setSeenNewNotifications,setConnectedUsers,setNotifications,setChatRooms,setFriends,setTypingUsers,setSocket}:LoginInterface) => {
  return <Login setChatRooms={setChatRooms} setConnectedUsers={setConnectedUsers} setFriends={setFriends} setNotifications={setNotifications} setSeenNewNotifications={setSeenNewNotifications} setSocket={setSocket} setTypingUsers={setTypingUsers} socket={socket} />;
}

export default LoginPage;
