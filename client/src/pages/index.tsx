import {
  Button,
  Link,
  useTheme,
  Text,
  Input,
  Spacer,
  Textarea,
  User,
  Container,
  Row,
  Col,
  Card,
  Grid,
  Loading,
} from "@nextui-org/react";
import { useTheme as useNextTheme } from "next-themes";
import AddIcon from "@mui/icons-material/Add";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import React, {
  useState,
  useRef,
  Dispatch,
  SetStateAction,
  FunctionComponent,
  useEffect,
} from "react";
import { Socket } from "socket.io-client";
import Nav from "@/components/Nav";
import LandingPage from "@/components/LandingPage";
import Notifications from "@/components/Notifications";

export interface Message {
  sender: UserDefinition | undefined;
  receiver?: UserDefinition | undefined;
  timestamp: number;
  content: string | undefined;
}

interface IndexProps {
  user: UserDefinition;
  socket: SocketWithUser | undefined;
  friends: UserDefinition[];
  typingUsers: string[];
  toggleSideBar: boolean;
  connectedUsers: UserDefinition[];
  notifications: React.FunctionComponent<{}>[];
  seenNewNotifications: boolean;
  toggleNotifications: boolean;
  setFriends: React.Dispatch<React.SetStateAction<UserDefinition[]>>;
  setSocket: React.Dispatch<React.SetStateAction<SocketWithUser | undefined>>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setTypingUsers: React.Dispatch<React.SetStateAction<string[]>>;
  setConnectedUsers: React.Dispatch<React.SetStateAction<UserDefinition[]>>;
  setNotifications: React.Dispatch<
    React.SetStateAction<FunctionComponent<{}>[]>
  >;
  setSeenNewNotifications: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentUser: Dispatch<SetStateAction<UserDefinition>>;
  DOMAIN_NAME: string;
  SERVER_PORT: number;
}
export interface UserDefinition {
  avatar: string;
  username: string;
  socketID?: string;
  loggedIn?: boolean;
  receivedFriendRequest?: boolean;
}
export interface SocketWithUser extends Socket {
  user?: {
    username: string;
    avatar: string;
  };
}
// TODO: change login with nextUI modal component or setup google/github login
// var socket: SocketWithUser | undefined = undefined;
function Index({
  DOMAIN_NAME,
  SERVER_PORT,
  user,
  socket,
  friends,
  setCurrentUser,
  setSeenNewNotifications,
  setNotifications,
  setFriends,
  setConnectedUsers,
  setMessages,
  setSocket,
  setTypingUsers,
}: IndexProps) {
  return (
    <Container fluid responsive gap={0} css={{ minWidth: "100%" }}>
        <LandingPage
          setSeenNewNotifications={setSeenNewNotifications}
          setSocket={setSocket}
          setFriends={setFriends}
          friends={friends}
          setCurrentUser={setCurrentUser}
          user={user}
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
