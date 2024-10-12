import { Message, SocketWithUser, UserDefinition } from "@/pages";
import { Button, Input, User, Text } from "@nextui-org/react";
import { useRouter } from "next/router";
import { FunctionComponent, useContext, useRef, useState } from "react";
import { io } from "socket.io-client";
import FriendRequest from "./FriendRequest";
import { ChatRoomDefinition } from "./ChatRoom";
import axios from "axios";
import { UserContextType, UserContext } from "@/Providers/UserContext";
import { Logo } from "@/pages/Logo";
import Divider from "@mui/material/Divider";
import Link from "next/link";

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
  setChatRooms,
  setSocket,
  setFriends,
  setConnectedUsers,
  setNotifications,
  setTypingUsers,
  setSeenNewNotifications,
  socket,
}: LandingPageProps) => {
  const [colors, setColors] = useState<Colours[]>(["default", "default"]);
  const username = useRef<HTMLInputElement | null>(null);
  const password = useRef<HTMLInputElement | null>(null);
  const email = useRef<HTMLInputElement | null>(null);
  const [avatar, setAvatar] = useState<string>("");
  const router = useRouter();
  const { user, setCurrentUser } = useContext<UserContextType>(UserContext);
  const setUser = async () => {
    const name = username?.current?.value || "";
    const pass = password?.current?.value || "";
    const email = password?.current?.value || "";
    var id = null;
    const image = avatar;
    if (name === "" || image === "") return;
    try {
      const response = await axios.post(
        `http://${process.env.NEXT_PUBLIC_DOMAIN_NAME}:${process.env.NEXT_PUBLIC_SERVER_PORT}/auth/register`,
        { username: name, password: pass, email: email, avatar: image }
      );
      if (response.status === 200) {
        const { _id, avatar, chatRooms, friends, username }: UserDefinition =
          response.data;
          id = _id;
        setCurrentUser({
          ...user,
          _id: _id,
          avatar: avatar,
          username: username,
          friends: friends,
          chatRooms: chatRooms,
          loggedIn: true,
        });
      } else return;
    } catch (error) {
      console.error(error);
    }

    if (socket === undefined) {
      var newSocket: SocketWithUser = io(`ws://${process.env.NEXT_PUBLIC_DOMAIN_NAME}:${process.env.NEXT_PUBLIC_SERVER_PORT}`, {
        query: {
          _id: id,
          username: name,
          avatar: image,
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
        ) => {
          setFriends((friends) => {
            return [
              ...friends,
              {
                ...sender,
                socketID: senderSocketID,
              },
            ];
          });
          setConnectedUsers((users) => {
            return [...users.filter((u) => u.socketID !== senderSocketID)];
          });
        }
      );
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
      newSocket.on("update connected users", (connectedUsers: UserDefinition[]) => {
        setFriends((allFriends) => {
          setConnectedUsers((users) => {
            const newUsers = connectedUsers.filter(
              (u) =>
                u.socketID !== newSocket?.id &&
                !users.some((us) => u.socketID === us.socketID) &&
                !allFriends.some((f) => f.socketID === u.socketID)
            );
            return [...users, ...newUsers];
          });
          return allFriends;
        });
      });
      
      newSocket.on("user disconnected", (sockedID: string) => {
        setConnectedUsers((users) => {
          return [...users.filter((u) => u.socketID !== sockedID)];
        });
      });
      newSocket.user = { ...user };
      setSocket(newSocket);
    }
    username!.current!.value = "";
    setAvatar("");
    router.push("/home");
  };
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div style={{ width: "80%", height: "60%" }}>
        <div className="flex  justify-evenly items-center w-full min-h-full border border-double rounded-xl">
          <span>
            <span className="flex text-4xl pl-6 items-center">
              <Logo width={50} height={50} />
              <Text b color="inherit" hideIn="xs">
                Quicksender
              </Text>
            </span>
            <Divider
              orientation="vertical"
              style={{ backgroundColor: "white" }}
            />
            <p className="font-normal text-4xl p-10">
              Sign up and start chatting!
            </p>
          </span>
          <div className="flex flex-col items-center justify-center w-1/2 h-full  ">
            <div className="flex">
              <div className="flex flex-col">
                <Input
                  id="username-input"
                  width="w-1/2"
                  label="Username"
                  ref={username}
                  clearable
                  css={{ padding: "10px" }}
                  contentRightStyling={false}
                  placeholder="Enter username..."
                  title="usernameInputBox"
                />
                <Input
                  id="email-input"
                  width="w-1/2"
                  label="Email"
                  ref={email}
                  css={{ padding: "10px" }}
                  type="email"
                  clearable
                  contentRightStyling={false}
                  placeholder="Enter email..."
                  title="Email"
                />
                <Input
                  id="password-input"
                  label="Password"
                  width="w-1/2"
                  ref={password}
                  css={{ padding: "10px" }}
                  type="password"
                  clearable
                  contentRightStyling={false}
                  placeholder="Enter password..."
                  title="passwordInputBox"
                />
              </div>
              <div className="flex justify-center items-center">
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
            </div>
            <div className="flex justify-evenly items-center pt-10 w-full">
              <Button title="setUsernameButton" onClick={setUser}>
                Start chatting!
              </Button>
              <div className="flex flex-col justify-center items-center relative">
                <Text className="pr-4 absolute -top-8">
                  Already have an account?{" "}
                </Text>
                <Link href="/auth/login">
                  <Button>Login</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
