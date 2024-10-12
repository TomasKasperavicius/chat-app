import { SocketWithUser, UserDefinition } from "@/pages";
import { Logo } from "@/pages/Logo";
import { Input, Button } from "@nextui-org/react";
import axios, { AxiosResponse } from "axios";
import { FunctionComponent, useContext, useRef } from "react";
import { useTheme, Text } from "@nextui-org/react";
import { UserContextType, UserContext } from "@/Providers/UserContext";
import { NextRouter, useRouter } from "next/router";
import { io } from "socket.io-client";
import { ChatRoomDefinition } from "./ChatRoom";
import FriendRequest from "./FriendRequest";
interface LoginInterface {
  socket: SocketWithUser | undefined;
  setChatRooms: React.Dispatch<React.SetStateAction<ChatRoomDefinition[]>>;
  setFriends: React.Dispatch<React.SetStateAction<UserDefinition[]>>;
  setSocket: React.Dispatch<React.SetStateAction<SocketWithUser | undefined>>;
  setTypingUsers: React.Dispatch<React.SetStateAction<string[]>>;
  setConnectedUsers: React.Dispatch<React.SetStateAction<UserDefinition[]>>;
  setNotifications: React.Dispatch<
    React.SetStateAction<FunctionComponent<{}>[]>
  >;
  setSeenNewNotifications: React.Dispatch<React.SetStateAction<boolean>>;
}
const Login: FunctionComponent<LoginInterface> = ({
  socket,
  setSeenNewNotifications,
  setConnectedUsers,
  setNotifications,
  setChatRooms,
  setFriends,
  setTypingUsers,
  setSocket,
}: LoginInterface) => {
  const userName = useRef<HTMLInputElement | null>(null);
  const pass = useRef<HTMLInputElement | null>(null);
  const { user, setCurrentUser } = useContext<UserContextType>(UserContext);
  const router: NextRouter = useRouter();

  const login = async () => {
    try {
      const response: AxiosResponse<any, any> = await axios.post(
        `http://${process.env.NEXT_PUBLIC_DOMAIN_NAME}:${process.env.NEXT_PUBLIC_SERVER_PORT}/auth/login`,
        {
          username: userName.current?.value ?? "",
          password: pass.current?.value ?? "",
        }
      );
      const { _id, avatar, chatRooms, friends, username }: UserDefinition =
        response.data;
      setCurrentUser({
        ...user,
        _id: _id,
        avatar: avatar,
        chatRooms: chatRooms,
        friends: friends,
        username: username,
        loggedIn: true,
      });
      if (socket === undefined) {
        var newSocket: SocketWithUser = io(
          `ws://${process.env.NEXT_PUBLIC_DOMAIN_NAME}:${process.env.NEXT_PUBLIC_SERVER_PORT}`,
          {
            query: {
              _id: _id,
              username: username,
              avatar: avatar,
            },
          }
        );

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
          (sender: UserDefinition, senderSocketID: string) => {
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
        newSocket.on(
          "update connected users",
          (connectedUsers: UserDefinition[]) => {
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
          }
        );

        newSocket.on("user disconnected", (sockedID: string) => {
          setConnectedUsers((users) => {
            return [...users.filter((u) => u.socketID !== sockedID)];
          });
        });
        newSocket.user = { ...user };
        setSocket(newSocket);
        router.push("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const { isDark } = useTheme();
  return (
    <div className="flex justify-center items-center h-screen">
      <div
        className="w-full max-w-md p-8 shadow-lg rounded-lg"
        style={{
          border: `1px solid ${isDark ? "white" : "black"}`,
        }}
      >
        <div className="flex flex-col items-center mb-8">
          <span className="flex text-4xl items-center">
            <Logo width={50} height={50} />
            <Text b color="inherit" hideIn="xs" css={{ paddingLeft: "16px" }}>
              Quicksender
            </Text>
          </span>
        </div>
        <Input
          id="userName-input"
          width="w-full"
          ref={userName}
          clearable
          css={{ padding: "10px" }}
          contentRightStyling={false}
          placeholder="Enter username..."
          title="userNameInputBox"
          className="mb-4"
        />
        <Input
          id="password-input"
          width="w-full"
          ref={pass}
          css={{ padding: "10px" }}
          type="password"
          clearable
          contentRightStyling={false}
          placeholder="Enter password..."
          title="passwordInputBox"
          className="mb-6"
        />
        <Button
          css={{ minWidth: "100%" }}
          title="setuserNameButton"
          onClick={login}
          className="w-full"
        >
          Start chatting!
        </Button>
      </div>
    </div>
  );
};

export default Login;
