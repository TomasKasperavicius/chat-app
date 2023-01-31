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
} from "@nextui-org/react";
import { useTheme as useNextTheme } from "next-themes";
import AddIcon from "@mui/icons-material/Add";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import React, { useState, useRef, Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";
import Nav from "@/components/Nav";
import LandingPage from "@/components/LandingPage";

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
}
export interface SocketWithUser extends Socket {
  user?: {
    username: string;
    avatar: string;
  };
}
// TODO: change login with nextUI modal component or setup google/github login
var socket: SocketWithUser | undefined = undefined;
function Home({ DOMAIN_NAME, SERVER_PORT, user, setCurrentUser }: HomeProps) {
  const [friends, setFriends] = useState<UserDefinition[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<UserDefinition[]>([]);
  const [toggleSideBar, setToggleSideBar] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const { setTheme } = useNextTheme();
  const { isDark, type } = useTheme();
  
  const addFriends = (user: UserDefinition) => {
    setFriends([...friends, user]);
    setConnectedUsers((u) => {
      return u.filter((obj) => obj.socketID !== user.socketID);
    });
  };
  return (
    <Container fluid responsive gap={0} css={{ minWidth: "100%" }}>
      {user.loggedIn ? (
        <>
          <Row fluid>
            <Col>
              <Nav
                type={type}
                isDark={isDark}
                setTheme={setTheme}
                user={user}
                setToggleSidebar={setToggleSideBar}
                setCurrentUser={setCurrentUser}
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
                <div onClick={()=> setToggleSideBar(false)} className="flex justify-end m-2">
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
              <div className=" p-5">
                {connectedUsers.length > 0 ? (
                  connectedUsers.map((user, key) => {
                    return (
                      <Card
                        key={key}
                        css={{ p: "$6", mw: "300px", margin: "20px" }}
                      >
                        <Card.Header>
                          <User name={user.username} src={user.avatar} />
                        </Card.Header>
                        <Card.Footer>
                          <Button
                            className="hover:opacity-70"
                            onClick={() => addFriends(user)}
                            iconRight={<AddIcon />}
                          >
                            Add to friends
                          </Button>
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
            </Col>
          </Row>
        </>
      ) : (
        <LandingPage
          setCurrentUser={setCurrentUser}
          user={user}
          setConnectedUsers={setConnectedUsers}
          setMessages={setMessages}
          setTypingUsers={setTypingUsers}
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
