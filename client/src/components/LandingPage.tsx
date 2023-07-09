import { Message, SocketWithUser, UserDefinition } from "@/pages";
import { Row, Col, Button, Input, User } from "@nextui-org/react";
import { useRouter } from "next/router";
import { FunctionComponent, useContext, useRef, useState } from "react";
import { io } from "socket.io-client";
import FriendRequest from "./FriendRequest";
import { ChatRoomDefinition } from "./ChatRoom";
import axios from "axios";
import { UserContextType, UserContext } from "@/Providers/UserContext";

interface LandingPageProps {
  socket: SocketWithUser | undefined;
  friends: UserDefinition[];
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
type Colours =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "gradient"
  | undefined;

const LandingPage: React.FunctionComponent<LandingPageProps> = ({
  friends,
  chatRooms,
  setChatRooms,
  setSocket,
  setFriends,
  setConnectedUsers,
  setNotifications,
  setMessages,
  setTypingUsers,
  setSeenNewNotifications,
  socket,
  DOMAIN_NAME,
  SERVER_PORT,
}: LandingPageProps) => {
  const [colors, setColors] = useState<Colours[]>(["default", "default"]);
  const userInput = useRef<HTMLInputElement | null>(null);
  const [avatar, setAvatar] = useState<string>("");
  const router = useRouter();
  const { user, setCurrentUser } = useContext<UserContextType>(UserContext);
  const setUser = async () => {
    const name = userInput?.current?.value ?? "";
    const image = avatar;
    if (name === "" || image === "") return;
    try {
      const response = await axios.post(
        `http://${DOMAIN_NAME}:${SERVER_PORT}/addUser`,
        { username: name, avatar: image }
      );
      const { _id, avatar, chatRooms, friends, username }: UserDefinition =
        response.data;
      console.log(response.data);
      setCurrentUser({
        ...user,
        _id: _id,
        avatar: avatar,
        username: username,
        friends: friends,
        chatRooms: chatRooms,
        loggedIn: true,
      });
    } catch (error) {
      console.error(error);
    }
    console.log(user);

    if (socket === undefined) {
      var newSocket: SocketWithUser = io(`ws://${DOMAIN_NAME}:${SERVER_PORT}`, {
        query: {
          username: name,
          avatar: avatar,
        },
      });

      newSocket.on(
        "received friend request",
        (sender: UserDefinition, senderSocketID: string) => {
          setSeenNewNotifications(false);
          setConnectedUsers((users) => {
            users.find(
              (u) => u.socketID === senderSocketID
            )!.receivedFriendRequest = true;
            return [...users];
          });
          setNotifications((not: any) => {
            return [
              ...not,
              <FriendRequest
                DOMAIN_NAME={DOMAIN_NAME}
                SERVER_PORT={SERVER_PORT}
                key={newSocket.id}
                setChatRooms={setChatRooms}
                setConnectedUsers={setConnectedUsers}
                setFriends={setFriends}
                setNotifications={setNotifications}
                socket={newSocket}
                sender={sender}
                senderSocketID={senderSocketID}
              />,
            ];
          });
        }
      );
      newSocket.on("friend request canceled", (senderSocketID: string) => {
        setConnectedUsers((users) => {
          users.find(
            (u) => u.socketID === senderSocketID
          )!.receivedFriendRequest = false;
          return [...users];
        });
      });
      newSocket.on(
        "friend request accepted",
        (
          sender: UserDefinition,
          senderSocketID: string,
          privateChatRoom: ChatRoomDefinition
        ) => {
          setFriends((friends) => {
            return [...friends, { ...sender, socketID: senderSocketID,privateChatID: privateChatRoom._id }];
          });
          setConnectedUsers((users) => {
            return [...users.filter((u) => u.socketID !== senderSocketID)];
          });
          newSocket.emit("joinRoom", privateChatRoom._id);
        }
      );
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
          setFriends((allFriends) => {
            setConnectedUsers((users) => {
              const newUsers = connectedUsers.filter((u) => {
                if (
                  u.socketID !== newSocket!.id &&
                  users.find((us) => u.socketID === us.socketID) ===
                    undefined &&
                  allFriends.find((f) => f.socketID === u.socketID) ===
                    undefined
                )
                  return true;
                return false;
              });
              return [...users, ...newUsers];
            });
            return allFriends;
          });
        }
      );
      newSocket.on("user disconnect", (sockedID: string) => {
        setConnectedUsers((users) => {
          return [...users.filter((u) => u.socketID !== sockedID)];
        });
      });
      newSocket.user = { ...user };
      setSocket(newSocket);
    }
    userInput!.current!.value = "";
    setAvatar("");
    router.push("/home");
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
                  setAvatar("/man.png");
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
                  setAvatar("/woman.png");
                }}
              />
            </div>
            <div className="flex  p-10">
              <Input
                id="username-input"
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
