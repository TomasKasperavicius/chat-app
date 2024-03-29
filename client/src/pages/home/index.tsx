import Nav from "@/components/Nav";
import {
  Card,
  Row,
  Col,
  User,
  Button,
  Container,
  Loading,
} from "@nextui-org/react";
import {
  Dispatch,
  FunctionComponent,
  Key,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
} from "react";
import { Message, SocketWithUser, UserDefinition } from "..";
import AddIcon from "@mui/icons-material/Add";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { NextRouter, useRouter } from "next/router";
import { UserContextType, UserContext } from "@/Providers/UserContext";
interface HomeProps {
  socket: SocketWithUser | undefined;
  friends: UserDefinition[];
  typingUsers: string[];
  toggleSideBar: boolean;
  connectedUsers: UserDefinition[];
  notifications: React.FunctionComponent<{}>[];
  seenNewNotifications: boolean;
  toggleNotifications: boolean;
  setToggleSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  setToggleNotifications: React.Dispatch<React.SetStateAction<boolean>>;
  setFriends: React.Dispatch<React.SetStateAction<UserDefinition[]>>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setTypingUsers: React.Dispatch<React.SetStateAction<string[]>>;
  setConnectedUsers: React.Dispatch<React.SetStateAction<UserDefinition[]>>;
  setNotifications: React.Dispatch<
    React.SetStateAction<FunctionComponent<{}>[]>
  >;
  setSeenNewNotifications: React.Dispatch<React.SetStateAction<boolean>>;
}

const Home: FunctionComponent<HomeProps> = ({
  connectedUsers,
  friends,
  notifications,
  seenNewNotifications,
  setConnectedUsers,
  setFriends,
  setMessages,
  setNotifications,
  setSeenNewNotifications,
  setToggleNotifications,
  setToggleSidebar,
  setTypingUsers,
  socket,
  toggleNotifications,
  toggleSideBar,
  typingUsers,
}) => {
  const router: NextRouter = useRouter();
  const {user,setCurrentUser} = useContext<UserContextType>(UserContext)
  console.log(user);
  useEffect(() => {
    if (socket === undefined || !user.loggedIn) {
      router.push("/");
    }
  }, []);
  
  const sendFriendRequest = (socketID: string | undefined) => {
    if (!socketID) return;
    setConnectedUsers((arr: UserDefinition[]) => {
      arr.find((u: UserDefinition) => u.socketID === socketID)!.receivedFriendRequest = true;
      return [...arr];
    });
    socket?.emit("send friend request", socketID, user);
    // setConnectedUsers((u) => {
    //   return u.filter((obj) => obj.socketID !== socketID);
    // });
  };
  return (
    <Container fluid responsive gap={0} css={{ minWidth: "100%" }}>
      <Row fluid>
        <Col>
          <Nav
            setSeenNewNotifications={setSeenNewNotifications}
            setToggleNotifications={setToggleNotifications}
            seenNewNotifications={seenNewNotifications}
            notifications={notifications}
            setToggleSidebar={setToggleSidebar}
            setNotifications={setNotifications}
            toggleSideBar={toggleSideBar}
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
              onClick={() => setToggleSidebar(false)}
              className="flex justify-end m-2"
            >
              <HighlightOffIcon className="h-full w-full hover:opacity-70 cursor-pointer" />
            </div>
            <div className="m-2">
              People online: {friends.length}
              {friends.length > 0 &&
                friends.map((friend: UserDefinition, key:Key) => {
                  return (
                    <div key={key} className="w-full m-5">
                      <User
                        name={friend.username}
                        src={friend.avatar}
                        zoomed
                        pointer
                        onClick={()=> router.push(`/chat/${friend.privateChatID}`)}
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
                connectedUsers.map((u:UserDefinition,key:Key) => {
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
                            onClick={() => sendFriendRequest(u?.socketID)}
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
            <div className="flex items-center justify-center p-10 m-10">
              {notifications.map((notification: unknown, key: Key | null | undefined) => {
                return <div key={key}>{notification as ReactNode}</div>;
              })}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
