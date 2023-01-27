import {
  Button,
  Link,
  Navbar,
  Switch,
  useTheme,
  Text,
  Input,
  Spacer,
  Textarea,
  Avatar,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { useTheme as useNextTheme } from "next-themes";
import { Logo } from "./Logo";
import { useSession, signIn, signOut } from "next-auth/react";
import { SendButton } from "./_SendButton";
import { SendIcon } from "./SendIcon";
import React, { useEffect, useState, useRef } from "react";
import io, { Socket } from "socket.io-client";
interface Message {
  sender: string;
  timestamp: number;
  content: string | undefined;
}

interface HomeProps {
  DOMAIN_NAME: string;
  SERVER_PORT: number;
}
var socket: Socket | undefined = undefined;
function Home({ DOMAIN_NAME, SERVER_PORT }: HomeProps) {
  //const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const [user, setUser] = useState<string>("");
  const messageInput = useRef<HTMLInputElement | null>(null);
  const userInput = useRef<HTMLInputElement | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  // const router = useRouter();
  useEffect(() => {
    // (async () => await fetch("/api/socket"))();
    if (socket === undefined) {
      var newSocket: Socket = io(`ws://${DOMAIN_NAME}:${SERVER_PORT}`);
      newSocket.on("message", (message: Message) => {
        setMessages((messages) => {
          return [...messages, message];
        });
      });
      newSocket.on("typing", (username: string) => {
        setTypingUsers((typingUsers) => {
          return [...typingUsers,  username];
        });
      });
      newSocket.on("stopped typing", (username: string) => {
        setTypingUsers((typingUsers) => {
          return [...typingUsers.filter((el) => el !== username)];
        });
      });
      socket = newSocket;
      // setSocket(newSocket);
    }
  }, []);

  const { setTheme } = useNextTheme();
  const { isDark, type } = useTheme();
  const collapseItems = [
    "Friends",
    "Chats",
    "Settings",
    "Company",
    "Login",
    "Sign Up",
  ];
  const sendMessage = () => {
    const msg: Message = {
      sender: user,
      timestamp: new Date().getTime(),
      content: messageInput?.current?.value,
    };
    messageInput!.current!.value = "";
    setMessages((messages) => {
      return [...messages, msg];
    });
    socket?.emit("message", msg);
  };
  const setUsername = () => {
    setUser(userInput?.current?.value ?? "");
    if (user === "") return;
    // router.push("/home");
  };
  return (
    <div className="w-full h-screen">
      <Navbar shouldHideOnScroll isBordered={isDark} variant="sticky">
        <Navbar.Brand>
          <Navbar.Toggle aria-label="toggle navigation" />
          <Logo />
          <Text b color="inherit" hideIn="xs">
            Quicksender
          </Text>
        </Navbar.Brand>
        <Navbar.Content hideIn="xs" variant="underline">
          <Navbar.Link id="1-link" href="#">
            Friends
          </Navbar.Link>
          <Navbar.Link id="2-link" isActive href="#">
            Chats
          </Navbar.Link>
          {/* <Navbar.Link id="3-link" href="#">
            Pricing
          </Navbar.Link>
          <Navbar.Link id="4-link" href="#">
            Company
          </Navbar.Link> */}
        </Navbar.Content>
        <Navbar.Content hideIn="xs" variant="underline">
          <Navbar.Item>
            <>
              {type[0] === "d"
                ? type.replace("d", "D")
                : type.replace("l", "L")}{" "}
              theme
            </>
          </Navbar.Item>
          <Navbar.Item>
            <Switch
              title="theme"
              placeholder=""
              size="xs"
              checked={isDark}
              onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
            />
          </Navbar.Item>
        </Navbar.Content>
        <Navbar.Content>
          {user !== "" ? (
            <Navbar.Item>
              <>Username: {user}</>
            </Navbar.Item>
          ) : (
            <Navbar.Item>
              <></>
            </Navbar.Item>
          )}
        </Navbar.Content>
        <Navbar.Content>
          <Navbar.Item>
            <Button
              title="googleAuthButton"
              auto
              flat
              as={Link}
              // onClick={() => signIn("google")}
            >
              Login
            </Button>
          </Navbar.Item>
          <Avatar
            title="avatar"
            alt="avatar"
            src="data:image/jpeg;base64,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"
          />
        </Navbar.Content>

        <Navbar.Collapse>
          {collapseItems.map((item, key) => (
            <Navbar.CollapseItem key={item}>
              <Link
                color="inherit"
                css={{
                  minWidth: "100%",
                }}
                href="#"
              >
                {item}
              </Link>
            </Navbar.CollapseItem>
          ))}
        </Navbar.Collapse>
      </Navbar>
      {user === "" ? (
        <div className="flex justify-center items-center w-full p-10">
          <Input
            ref={userInput}
            clearable
            contentRightStyling={false}
            placeholder="Enter username..."
            title="usernameInputBox"
            contentRight={
              <Button size="md" title="setUsernameButton" onClick={setUsername}>
                Start chatting!
              </Button>
            }
          />
        </div>
      ) : (
        <div className="flex flex-col items-center h-full">
          <div className="flex flex-col items-center w-full h-3/4 overflow-y-scroll">
            {messages.length > 0 &&
              messages.map((message, key) => {
                return (
                  <>
                    {message.sender === user ? (
                      <div key={key} className="flex w-1/3 justify-end">
                        <div className="flex flex-col py-10 ">
                          <Textarea
                            readOnly
                            label={"You"}
                            placeholder={message.content}
                            status="success"
                          />
                          <span>
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div key={key} className="flex w-1/3">
                        <div className="flex flex-col py-10 ">
                          <Textarea
                            readOnly
                            label={message.sender}
                            placeholder={message.content}
                          />
                          <span>
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                );
              })}
          </div>
          <div>
          {typingUsers.length > 0 &&
            typingUsers.map((user, key) => {
              return <div key={key}>{user} is typing...</div>;
            })}
            </div>
          <div className="flex w-1/2 relative">
            <div className="w-full flex justify-end absolute">
              <Input
                width="60%"
                ref={messageInput}
                clearable
                contentRightStyling={false}
                placeholder="Type your message..."
                title="messageInputBox"
                onFocus={() => socket?.emit("typing", user)}
                onBlur={() => socket?.emit("stopped typing", user)}
                contentRight={
                  <SendButton title="sendMessageButton" onClick={sendMessage}>
                    <SendIcon
                      filled={undefined}
                      size={undefined}
                      height={undefined}
                      width={undefined}
                      label={undefined}
                      className={undefined}
                    />
                  </SendButton>
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
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
export default Home;
