import { Container } from "@nextui-org/react";
import React, { Dispatch, SetStateAction, FunctionComponent } from "react";
import { Socket } from "socket.io-client";
import LandingPage from "@/components/LandingPage";
import { ChatRoomDefinition } from "@/components/ChatRoom";
export interface Message {
  sender: UserDefinition | undefined;
  receiver?: UserDefinition | undefined;
  timestamp: number;
  content: string | undefined;
}

interface IndexProps {
  socket: SocketWithUser | undefined;
  friends: UserDefinition[];
  typingUsers: string[];
  toggleSideBar: boolean;
  connectedUsers: UserDefinition[];
  notifications: React.FunctionComponent<{}>[];
  seenNewNotifications: boolean;
  toggleNotifications: boolean;
  chatRooms: ChatRoomDefinition[];
  setChatRooms: React.Dispatch<React.SetStateAction<ChatRoomDefinition[]>>;
  setFriends: React.Dispatch<React.SetStateAction<UserDefinition[]>>;
  setSocket: React.Dispatch<React.SetStateAction<SocketWithUser | undefined>>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setTypingUsers: React.Dispatch<React.SetStateAction<string[]>>;
  setConnectedUsers: React.Dispatch<React.SetStateAction<UserDefinition[]>>;
  setNotifications: React.Dispatch<
    React.SetStateAction<FunctionComponent<{}>[]>
  >;
  setSeenNewNotifications: React.Dispatch<React.SetStateAction<boolean>>;
  DOMAIN_NAME: string;
  SERVER_PORT: number;
}
export interface UserDefinition {
  _id: string;
  avatar: string;
  username: string;
  friends: UserDefinition[];
  chatRooms: ChatRoomDefinition[];
  socketID?: string;
  loggedIn?: boolean;
  receivedFriendRequest?: boolean;
  privateChatID?: string;
}
export interface SocketWithUser extends Socket {
  user?: UserDefinition;
}
// TODO: change login with nextUI modal component or setup google/github login
// var socket: SocketWithUser | undefined = undefined;
function Index({
  DOMAIN_NAME,
  SERVER_PORT,
  chatRooms,
  connectedUsers,
  notifications,
  seenNewNotifications,
  setChatRooms,
  toggleNotifications,
  toggleSideBar,
  typingUsers,
  socket,
  friends,
  setSeenNewNotifications,
  setNotifications,
  setFriends,
  setConnectedUsers,
  setMessages,
  setSocket,
  setTypingUsers,
}: IndexProps) {
  return (
    <Container fluid responsive gap={0} css={{ minWidth: "100%" }} className="m-0">
      <LandingPage
        setSeenNewNotifications={setSeenNewNotifications}
        chatRooms={chatRooms}
        setChatRooms={setChatRooms}
        setSocket={setSocket}
        setFriends={setFriends}
        friends={friends}
        setConnectedUsers={setConnectedUsers}
        setMessages={setMessages}
        setTypingUsers={setTypingUsers}
        setNotifications={setNotifications}
        socket={socket}
        DOMAIN_NAME={DOMAIN_NAME}
        SERVER_PORT={SERVER_PORT}
      />
    </Container>
  );
}

export const getStaticProps = async () => {
  return {
    props: {
      DOMAIN_NAME: process.env.DOMAIN_NAME,
      SERVER_PORT: process.env.SERVER_PORT,
    },
  };
};
export default Index;
