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

interface HomeProps {
  user: UserDefinition;
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
function Home({ DOMAIN_NAME, SERVER_PORT, user, setCurrentUser }: HomeProps) {
  const [socket, setSocket] = useState<SocketWithUser | undefined>(undefined);
  const [friends, setFriends] = useState<UserDefinition[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<UserDefinition[]>([]);
  const [toggleSideBar, setToggleSideBar] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<FunctionComponent[]>([]);
  const { setTheme } = useNextTheme();
  const { isDark, type } = useTheme();
  const [toggleNotifications, setToggleNotifications] =
    useState<boolean>(false);
  const [seenNewNotifications, setSeenNewNotifications] =
    useState<boolean>(true);
  const sendFriendRequest = (socketID: string | undefined) => {
    
    if (!socketID) return;
    setConnectedUsers((arr) => {
      arr.find((u) => u.socketID === socketID)!.receivedFriendRequest = true;
      return [...arr];
    });
    socket?.emit("send friend request", socketID, user);
    // setConnectedUsers((u) => {
    //   return u.filter((obj) => obj.socketID !== socketID);
    // });
  };
  return (
    <Container fluid responsive gap={0} css={{ minWidth: "100%" }}>
      {user.loggedIn ? (
        <>
          <Row fluid>
            <Col>
              <Nav
                setSeenNewNotifications={setSeenNewNotifications}
                setToggleNotifications={setToggleNotifications}
                seenNewNotifications={seenNewNotifications}
                notifications={notifications}
                type={type}
                isDark={isDark}
                setTheme={setTheme}
                user={user}
                setToggleSidebar={setToggleSideBar}
                setCurrentUser={setCurrentUser}
                setNotifications={setNotifications}
              />
            </Col>
          </Row>
          <Row fluid css={{ minHeight: "100vh" }}>
            {toggleSideBar && (
              <Col
                span={2}
                css={{
                  minHeight: "100vh",
                  display: "flex",
                  flexDirection: "column",
                  borderRight: "solid",
                }}
              >
                <div
                  onClick={() => setToggleSideBar(false)}
                  className="flex justify-end m-2"
                >
                  <HighlightOffIcon className="h-full w-full hover:opacity-70 cursor-pointer" />
                </div>
                <div className="m-2">
                  People online: {friends.length}
                  {friends.length > 0 &&
                    friends.map((friend, key) => {
                      return (
                        <div key={key} className="w-full m-5">
                          <User
                            name={friend.username}
                            src={friend.avatar}
                            pointer
                          />
                        </div>
                      );
                    })}
                </div>
              </Col>
            )}
            <Col>
              {!toggleNotifications ? (
                <div className=" p-5">
                  {connectedUsers.length > 0 ? (
                    connectedUsers.map((u, key) => {
                      return (
                        <Card
                          key={key}
                          css={{ p: "$6", mw: "300px", margin: "20px" }}
                        >
                          <Card.Header>
                            <User name={u.username} src={u.avatar} />
                          </Card.Header>
                          <Card.Footer>
                            {!u.receivedFriendRequest ? (
                              <Button
                                className="hover:opacity-70"
                                onClick={() =>
                                  sendFriendRequest(u?.socketID)
                                }
                                iconRight={<AddIcon />}
                              >
                                Add to friends
                              </Button>
                            ) : (
                              <Button
                                css={{ width: "100%" }}
                                iconRight={<Loading color="white" size="sm" />}
                              >
                                Waiting for response...
                              </Button>
                            )}
                          </Card.Footer>
                        </Card>
                      );
                    })
                  ) : (
                    <div className="h-screen flex justify-center items-center">
                      No new people online...
                    </div>
                  )}
                </div>
              ) : (
                <Notifications notifications={notifications} />
              )}
            </Col>
          </Row>
        </>
      ) : (
        <LandingPage
          setSeenNewNotifications={setSeenNewNotifications}
          setSocket={setSocket}
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
      )}
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
