import { Message, SocketWithUser, UserDefinition } from "@/pages";
import { Row, Col, Button, Input, User } from "@nextui-org/react";
import { FunctionComponent, useRef, useState } from "react";
import { io } from "socket.io-client";

interface LandingPageProps {
  user: UserDefinition;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserDefinition>>;
  socket: SocketWithUser | undefined;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setTypingUsers: React.Dispatch<React.SetStateAction<string[]>>;
  setConnectedUsers: React.Dispatch<React.SetStateAction<UserDefinition[]>>;
  DOMAIN_NAME: string;
  SERVER_PORT: number;
}
type Colours =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "gradient"
  | undefined;

const LandingPage: FunctionComponent<LandingPageProps> = ({
  user,
  setCurrentUser,
  setConnectedUsers,
  setMessages,
  setTypingUsers,
  socket,
  DOMAIN_NAME,
  SERVER_PORT,
}: LandingPageProps) => {
  const [colors, setColors] = useState<Colours[]>(["default", "default"]);
  const userInput = useRef<HTMLInputElement | null>(null);
  const setUser = () => {
    const username = userInput?.current?.value ?? "";
    if (username === "" || user?.avatar === "") return;
    setCurrentUser({
      username: username,
      avatar: user.avatar,
      loggedIn: true,
    });
    if (socket === undefined) {
      var newSocket: SocketWithUser = io(`ws://${DOMAIN_NAME}:${SERVER_PORT}`, {
        query: {
          username: username,
          avatar: user.avatar,
        },
      });
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
      newSocket.on(
        "update connected users",
        (connectedUsers: UserDefinition[]) => {
          setConnectedUsers((users) => {
            users = connectedUsers.filter((u) => {
              if (u.socketID !== socket?.id) return true;
              return false;
            });
            return users;
          });
        }
      );
      socket = newSocket;
    }
    socket!.user = { avatar: user.avatar, username: username };
    userInput!.current!.value = "";
  };
  return (
    <>
      <Row fluid>
        <Col
          span={12}
          css={{
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
            minHeight: "30vh",
            justifyContent: "center",
          }}
        >
          <Row fluid justify="center" css={{ margin: "10px" }}>
            Already have an account?
          </Row>
          <Row fluid justify="center" css={{ margin: "10px" }}>
            <Button>Login</Button>
          </Row>
        </Col>
      </Row>
      <Row fluid css={{ minHeight: "100vh" }}>
        <Col>
          <div className="flex flex-col justify-evenly items-center w-full max-h-full">
            <p className="font-normal text-7xl p-10">
              Sign up and start chatting!
            </p>
            <div className="flex justify-center items-center  p-10">
              Select avatar:
              <User
                color={colors[0]}
                zoomed
                bordered
                pointer
                name=""
                src="/man.png"
                onClick={() => {
                  setColors((color) => {
                    color[0] = "success";
                    color[1] = "default";
                    return color;
                  });
                  setCurrentUser((user) => {
                    return { username: user.username, avatar: "/man.png" };
                  });
                }}
              />
              <User
                color={colors[1]}
                zoomed
                bordered
                pointer
                name=""
                src="/woman.png"
                onClick={() => {
                  setColors((color) => {
                    color[1] = "success";
                    color[0] = "default";
                    return color;
                  });
                  setCurrentUser((user: UserDefinition) => {
                    return { username: user.username, avatar: "/woman.png" };
                  });
                }}
              />
            </div>
            <div className="flex  p-10">
              <Input
                width="w-1/2"
                ref={userInput}
                clearable
                contentRightStyling={false}
                placeholder="Enter username..."
                title="usernameInputBox"
              />
              <Button
                css={{ minWidth: "10%", marginRight: "20px" }}
                title="setUsernameButton"
                onClick={setUser}
              >
                Start chatting!
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default LandingPage;
