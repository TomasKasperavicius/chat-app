import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {
  NextUIProvider,
  createTheme,
} from "@nextui-org/react";
import {
  ThemeProvider as NextThemesProvider,
} from "next-themes";
import { FunctionComponent, useState } from "react";
import { Message, SocketWithUser, UserDefinition } from ".";
import { UserProvider } from "@/Providers/UserContext";
import { NextRouter, useRouter } from "next/router";
import { ChatRoomProvider } from "@/Providers/ChatRoomContext";

const lightTheme = createTheme({
  type: "light",
  theme: {},
});

const darkTheme = createTheme({
  type: "dark",
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
  const [toggleNotifications, setToggleNotifications] =
    useState<boolean>(false);
  const [seenNewNotifications, setSeenNewNotifications] =
    useState<boolean>(true);
  const [activeLink, setActiveLink] = useState<string>("");
  // const router: NextRouter = useRouter();
  // useEffect(() => {
  //   if (socket === undefined || !user.loggedIn) {
  //     router.push("/");
  //   }
  // }, []);
  return (
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
            <ChatRoomProvider>
            <UserProvider>
            <Component
              {...pageProps}
              connectedUsers={connectedUsers}
              friends={friends}
              notifications={notifications}
              seenNewNotifications={seenNewNotifications}
              activeLink={activeLink}
              setActiveLink={setActiveLink}
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
            </ChatRoomProvider>
          </main>
        </NextUIProvider>
      </NextThemesProvider>
  );
}
