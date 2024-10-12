import Nav from "@/components/Nav";
import {
  Container,
  Row,
  Col,
  User,
} from "@nextui-org/react";
import { Dispatch, FunctionComponent, ReactNode, SetStateAction, useContext } from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Message, SocketWithUser, UserDefinition } from ".";
import { useRouter } from "next/router";
import { UserContextType,UserContext } from "@/Providers/UserContext";

interface NotificationsProps {
  user: UserDefinition;
  socket: SocketWithUser | undefined;
  friends: UserDefinition[];
  typingUsers: string[];
  toggleSideBar: boolean;
  connectedUsers: UserDefinition[];
  notifications: React.FunctionComponent<{}>[];
  seenNewNotifications: boolean;
  toggleNotifications: boolean;
  activeLink: string;
  setToggleSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  setToggleNotifications: React.Dispatch<React.SetStateAction<boolean>>;
  setFriends: React.Dispatch<React.SetStateAction<UserDefinition[]>>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setTypingUsers: React.Dispatch<React.SetStateAction<string[]>>;
  setConnectedUsers: React.Dispatch<React.SetStateAction<UserDefinition[]>>;
  setNotifications: React.Dispatch<
    React.SetStateAction<FunctionComponent<{}>[]>
  >;
  setActiveLink: React.Dispatch<React.SetStateAction<string>>;
  setSeenNewNotifications: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentUser: Dispatch<SetStateAction<UserDefinition>>;
}

const Notifications: FunctionComponent<NotificationsProps> = ({
  friends,
  notifications,
  seenNewNotifications,
  activeLink,
  setNotifications,
  setSeenNewNotifications,
  setToggleNotifications,
  setToggleSidebar,
  setActiveLink,
  toggleSideBar,
}: NotificationsProps) => {
  const {user} = useContext<UserContextType>(UserContext)
  const router = useRouter()
  return (
    <Container fluid responsive gap={0} css={{ minWidth: "100%" }}>
      <Row fluid>
        <Col>
          <Nav
            setSeenNewNotifications={setSeenNewNotifications}
            setToggleNotifications={setToggleNotifications}
            seenNewNotifications={seenNewNotifications}
            notifications={notifications}
            toggleSideBar={toggleSideBar}
            setToggleSidebar={setToggleSidebar}
            setNotifications={setNotifications}
            setActiveLink={setActiveLink}
            activeLink={activeLink}
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
                friends.map((friend, key) => {
                  return (
                    <div key={key} className="w-full m-5">
                      <User
                        name={friend.username}
                        src={friend.avatar}
                        pointer
                        onClick={()=> router.push("/")}
                      />
                    </div>
                  );
                })}
            </div>
          </Col>
        )}
        <Col>
          <div className="flex items-center justify-center p-10 m-10">
            {notifications.map((notification: unknown, key) => {
              return <div key={key}>{notification as ReactNode}</div>;
            })}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Notifications;
