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
  User,
  Container,
  Row,
  Col,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { useTheme as useNextTheme } from "next-themes";
import { useSession, signIn, signOut } from "next-auth/react";
import { SendButton } from "./_SendButton";
import { SendIcon } from "./SendIcon";
import React, { useEffect, useState, useRef } from "react";
import io, { Socket } from "socket.io-client";
import Nav from "@/components/Nav";
interface Message {
  sender: UserDefinition | undefined;
  receiver?: UserDefinition | undefined;
  timestamp: number;
  content: string | undefined;
}

interface HomeProps {
  DOMAIN_NAME: string;
  SERVER_PORT: number;
}
export interface UserDefinition {
  avatar: string;
  username: string;
}
// TODO: change login with nextUI modal component or setup google/github login
var socket: Socket | undefined = undefined;
function Home({ DOMAIN_NAME, SERVER_PORT }: HomeProps) {
  //const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const [user, setCurrentUser] = useState<UserDefinition>({avatar:"",username:""});
  const [users, setUsers] = useState<UserDefinition[]>([
    { avatar: "/man.png", username: "Test" },
  ]);
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
      newSocket.on("room created", (username: string) => {
        setTypingUsers((typingUsers) => {
          return [...typingUsers, username];
        });
      });
      newSocket.on("typing", (username: string) => {
        setTypingUsers((typingUsers) => {
          return [...typingUsers, username];
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
  const setUser = () => {
    setCurrentUser({username:userInput?.current?.value ?? "",avatar:user.avatar});
    if (user?.username === "" || user?.avatar === "") return;
    // router.push("/home");
  };
  return (
    <Container fluid responsive gap={0} css={{ minWidth: "100%" }}>
      <Row fluid>
        <Col>
          <Nav type={type} isDark={isDark} setTheme={setTheme} user={user} />
        </Col>
      </Row>
      <Row fluid css={{ minHeight: "100vh" }}>
        <Col
          span={2}
          css={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            borderRight:"solid"
          }}
        >
          <div className="m-2">People online {users.length}</div>
          {users.length > 0 &&
            users.map((user, key) => {
              return (
                <div key={key} className="w-full m-5">
                  <User name={user.username} src={user.avatar} pointer/>
                </div>
              );
            })}
        </Col>
        <Col span={10} css={{ minHeight: "100vh" }}>
          {user?.username === "" ? (
            <div className="flex flex-col justify-evenly items-center w-full h-screen p-10">
              <p className="font-normal text-7xl">
                Sign up and start chatting!
              </p>
              <div className="flex justify-center items-center">
                Select avatar:
                <User zoomed bordered pointer name="" src="/man.png" onClick={()=> setCurrentUser((user) => {return {username:user.username,avatar:"/man.png"}})}/>
                <User zoomed bordered pointer name="" src="/woman.png" onClick={()=> setCurrentUser((user) => {return {username:user.username,avatar:"/woman.png"}})}/>
              </div>
              <div className="flex">
                <Input
                width="w-1/2"
                  ref={userInput}
                  clearable
                  contentRightStyling={false}
                  placeholder="Enter username..."
                  title="usernameInputBox"
                />
                <Button css={{minWidth:"10%", marginRight:"20px"}} title="setUsernameButton" onClick={setUser}>
                  Start chatting!
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center h-full">
              <div className="flex flex-col items-center w-3/4 h-3/4 overflow-y-auto">
                {messages.length > 0 &&
                  messages.map((message, key) => {
                    return (
                      <>
                        {message.sender?.username === user.username ? (
                          <div key={key} className="flex w-1/3 justify-end">
                            <div className="flex flex-col py-10 ">
                              <Textarea
                                readOnly
                                label={"You"}
                                placeholder={message.content}
                                status="success"
                              />
                              <span>
                                {new Date(
                                  message.timestamp
                                ).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div key={key} className="flex w-1/3">
                            <div className="flex flex-col py-10 ">
                              <Textarea
                                readOnly
                                label={message.sender?.username}
                                placeholder={message.content}
                              />
                              <span>
                                {new Date(
                                  message.timestamp
                                ).toLocaleTimeString()}
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
                <div className="w-3/4 flex justify-center">
                  <Input
                    ref={messageInput}
                    clearable
                    contentRightStyling={false}
                    placeholder="Type your message..."
                    title="messageInputBox"
                    onFocus={() => socket?.emit("typing", user)}
                    onBlur={() => socket?.emit("stopped typing", user)}
                    contentRight={
                      <SendButton
                        title="sendMessageButton"
                        onClick={sendMessage}
                      >
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
          )}
        </Col>
      </Row>
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
export default Home;
