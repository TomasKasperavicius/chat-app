import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {
  NextUIProvider,
  createTheme,
} from "@nextui-org/react";
import {
  ThemeProvider as NextThemesProvider,
} from "next-themes";
import { SessionProvider } from "next-auth/react";
import { FunctionComponent, useState } from "react";
import { Message, SocketWithUser, UserDefinition } from ".";
import { ChatRoomDefinition } from "@/components/ChatRoom";
import { UserProvider } from "@/Providers/UserContext";

const lightTheme = createTheme({
  type: "Light",
  theme: {},
});

const darkTheme = createTheme({
  type: "Dark",
  theme: {},
});

export default function App({ Component, pageProps }: AppProps) {
  
  const [socket, setSocket] = useState<SocketWithUser | undefined>(undefined);
  const [friends, setFriends] = useState<UserDefinition[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<UserDefinition[]>([]);
  const [toggleSideBar, setToggleSideBar] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<FunctionComponent[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoomDefinition[]>([]);
  const [toggleNotifications, setToggleNotifications] =
    useState<boolean>(false);
  const [seenNewNotifications, setSeenNewNotifications] =
    useState<boolean>(true);
  return (
    //<SSRProvider></SSRProvider>
    <SessionProvider session={pageProps.session}>
      <NextThemesProvider

        defaultTheme="system"
        attribute="class"
        value={{
          light: lightTheme.className,
          dark: darkTheme.className,
        }}
      >
        <NextUIProvider >
          <main className="w-full h-screen m-0">
            <UserProvider>
            <Component
              {...pageProps}
              connectedUsers={connectedUsers}
              friends={friends}
              notifications={notifications}
              seenNewNotifications={seenNewNotifications}
              chatRooms={chatRooms}
              setChatRooms={setChatRooms}
              setConnectedUsers={setConnectedUsers}
              setFriends={setFriends}
              setMessages={setMessages}
              setNotifications={setNotifications}
              setSeenNewNotifications={setSeenNewNotifications}
              setSocket={setSocket}
              setToggleNotifications={setToggleNotifications}
              setToggleSidebar={setToggleSideBar}
              setTypingUsers={setTypingUsers}
              socket={socket}
              toggleNotifications={toggleNotifications}
              toggleSideBar={toggleSideBar}
              typingUsers={typingUsers}
            />
            </UserProvider>
          </main>
        </NextUIProvider>
      </NextThemesProvider>
    </SessionProvider>
  );
}
