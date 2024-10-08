import Nav from "@/components/Nav";
import { Row, Col, User, Container } from "@nextui-org/react";
import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { NextRouter, useRouter } from "next/router";
import ChatRoom, { ChatRoomDefinition } from "@/components/ChatRoom";
import { UserDefinition, SocketWithUser, Message } from "@/pages";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
interface ChatRoomHomeProps {
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
  setActiveLink: React.Dispatch<React.SetStateAction<string>>;
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
  setCurrentUser: Dispatch<SetStateAction<UserDefinition>>;
  DOMAIN_NAME: string;
  SERVER_PORT: number;
}

const ChatRoomHome: FunctionComponent<ChatRoomHomeProps> = ({
  friends,
  notifications,
  activeLink,
  seenNewNotifications,
  setActiveLink,
  setNotifications,
  setSeenNewNotifications,
  setToggleNotifications,
  setToggleSidebar,
  socket,
  toggleSideBar,
  typingUsers,
  DOMAIN_NAME,
  SERVER_PORT,
}) => {
  const router: NextRouter = useRouter();
  const [data, setData] = useState<ChatRoomDefinition>();
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `http://${DOMAIN_NAME}:${SERVER_PORT}/chatrooms/${router.query.id}`
      );
      setData(response.data);
    };
    fetchData();
  }, []);

  return (
    <Container fluid responsive gap={0} css={{ minWidth: "100%" }}>
      <Row fluid>
        <Col>
          <Nav
            activeLink={activeLink}
            setActiveLink={setActiveLink}
            setSeenNewNotifications={setSeenNewNotifications}
            setToggleNotifications={setToggleNotifications}
            toggleSideBar={toggleSideBar}
            seenNewNotifications={seenNewNotifications}
            notifications={notifications}
            setToggleSidebar={setToggleSidebar}
            setNotifications={setNotifications}
          />
        </Col>
      </Row>
      <Row fluid css={{ minHeight: "100vh" }}>
      {toggleSideBar && (
          <Sidebar friends={friends}  setToggleSidebar={setToggleSidebar} activeLink={activeLink} setActiveLink={setActiveLink}/>
        )}
        <ChatRoom chatRoom={data} socket={socket} typingUsers={typingUsers} DOMAIN_NAME={DOMAIN_NAME} SERVER_PORT={SERVER_PORT}/>
      </Row>
    </Container>
  );
};

export const getServerSideProps = async () => {
  return {
    props: {
      DOMAIN_NAME: process.env.DOMAIN_NAME,
      SERVER_PORT: process.env.SERVER_PORT,
    },
  };
};
export default ChatRoomHome;
