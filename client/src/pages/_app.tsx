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

const lightTheme = createTheme({
  type: "light",
  theme: {},
});

const darkTheme = createTheme({
  type: "dark",
  theme: {},
});

export default function App({ Component, pageProps }: AppProps) {
  const [user, setCurrentUser] = useState<UserDefinition>({
    avatar: "",
    username: "",
    loggedIn: false,
  });
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
          <main className="w-full h-screen">
            <Component
              {...pageProps}
              connectedUsers={connectedUsers}
              friends={friends}
              notifications={notifications}
              seenNewNotifications={seenNewNotifications}
              setConnectedUsers={setConnectedUsers}
              setCurrentUser={setCurrentUser}
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
              user={user}
            />
          </main>
        </NextUIProvider>
      </NextThemesProvider>
    </SessionProvider>
  );
}
